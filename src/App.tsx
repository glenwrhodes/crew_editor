import { useState, useCallback, DragEvent, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  useReactFlow,
  ReactFlowProvider,
  addEdge,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import theme, { COLORS } from './theme';
import {
  AgentData, TaskData, CrewSettings, SavedGraph, SavedAgent, SavedTask,
  DEFAULT_AGENT_DATA, DEFAULT_TASK_DATA, DEFAULT_CREW_SETTINGS, migrateNodeData,
} from './types';
import { generateAgentsYaml, generateTasksYaml, generatePythonCode } from './utils/export';
import useUndoRedo from './hooks/useUndoRedo';

import AgentNode from './components/nodes/AgentNode';
import TaskNode from './components/nodes/TaskNode';
import BeginNode from './components/nodes/BeginNode';
import RerouteNode from './components/nodes/RerouteNode';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import ConfirmModal from './components/modals/ConfirmModal';
import ExportModal from './components/modals/ExportModal';
import SaveModal from './components/modals/SaveModal';
import LoadModal from './components/modals/LoadModal';
import CrewSettingsModal from './components/modals/CrewSettingsModal';
import { WelcomeScreen, TemplateModal } from './components/TemplateGallery';
import { CrewTemplate } from './utils/templates';
import './App.css';

const getId = () => `node_${uuidv4()}`;

const nodeTypes = {
  task: TaskNode,
  agent: AgentNode,
  begin: BeginNode,
  reroute: RerouteNode,
};

function Flow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [crewSettings, setCrewSettings] = useState<CrewSettings>({ ...DEFAULT_CREW_SETTINGS });
  const [activeGraphTitle, setActiveGraphTitle] = useState('Untitled');
  const [savedGraphs, setSavedGraphs] = useState<SavedGraph[]>([]);
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>([]);
  const [savedTasks, setSavedTasks] = useState<SavedTask[]>([]);

  // Modal states
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportMode, setExportMode] = useState<'yaml' | 'python'>('yaml');
  const [crewSettingsOpen, setCrewSettingsOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({ open: false, title: '', message: '', variant: 'warning', onConfirm: () => {} });

  const { project } = useReactFlow();
  const { takeSnapshot, undo, redo, canUndo, canRedo, clear: clearHistory } = useUndoRedo();
  const snapshotTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced snapshot for node data changes
  const debouncedSnapshot = useCallback(() => {
    if (snapshotTimeoutRef.current) clearTimeout(snapshotTimeoutRef.current);
    snapshotTimeoutRef.current = setTimeout(() => {
      setNodes(currentNodes => {
        setEdges(currentEdges => {
          takeSnapshot(currentNodes, currentEdges);
          return currentEdges;
        });
        return currentNodes;
      });
    }, 500);
  }, [takeSnapshot]);

  // Load persisted data on mount
  useEffect(() => {
    try {
      const graphs = JSON.parse(localStorage.getItem('savedGraphs') || '[]');
      setSavedGraphs(graphs);
    } catch { /* ignore */ }
    try {
      const agents = JSON.parse(localStorage.getItem('savedAgents') || '[]');
      setSavedAgents(agents);
    } catch { /* ignore */ }
    try {
      const tasks = JSON.parse(localStorage.getItem('savedTasks') || '[]');
      setSavedTasks(tasks);
    } catch { /* ignore */ }
  }, []);

  const selectedNode = useMemo(
    () => nodes.find(n => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  // Node & edge change handlers
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    const hasStructuralChange = changes.some(
      c => c.type === 'remove' || c.type === 'add'
    );
    if (hasStructuralChange) {
      setNodes(nds => {
        setEdges(eds => {
          takeSnapshot(nds, eds);
          return eds;
        });
        return nds;
      });
    }
    setNodes(nds => applyNodeChanges(changes, nds));
  }, [takeSnapshot]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    const hasStructuralChange = changes.some(c => c.type === 'remove' || c.type === 'add');
    if (hasStructuralChange) {
      setNodes(nds => {
        setEdges(eds => {
          takeSnapshot(nds, eds);
          return eds;
        });
        return nds;
      });
    }
    setEdges(eds => applyEdgeChanges(changes, eds));
  }, [takeSnapshot]);

  const onSelectionChange = useCallback(({ nodes: selectedNodes }: { nodes: Node[] }) => {
    setSelectedNodeId(selectedNodes.length === 1 ? selectedNodes[0].id : null);
  }, []);

  // Connection logic
  const onConnect = useCallback((params: Connection) => {
    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);
    if (!sourceNode || !targetNode || !params.source || !params.target) return;

    // Handle reroute node type claiming
    if (targetNode.type === 'reroute' && !targetNode.data.claimedType) {
      const isExec = sourceNode.type === 'begin' ||
        (sourceNode.type === 'task' && params.sourceHandle === 'exec-out') ||
        (sourceNode.type === 'reroute' && sourceNode.data.claimedType === 'execution');
      const isAgent = sourceNode.type === 'agent' ||
        (sourceNode.type === 'reroute' && sourceNode.data.claimedType === 'agent');

      if (isExec || isAgent) {
        setNodes(nds => nds.map(n =>
          n.id === targetNode.id
            ? { ...n, data: { ...n.data, claimedType: isExec ? 'execution' : 'agent' } }
            : n
        ));
      }
    }

    const isValid =
      (sourceNode.type === 'agent' && targetNode.type === 'task' && params.targetHandle === 'agent') ||
      (sourceNode.type === 'task' && targetNode.type === 'task' && params.targetHandle === 'exec-in') ||
      (sourceNode.type === 'begin' && targetNode.type === 'task' && params.targetHandle === 'exec-in') ||
      targetNode.type === 'reroute' ||
      (sourceNode.type === 'reroute' && (
        (sourceNode.data.claimedType === 'execution' && params.targetHandle === 'exec-in') ||
        (sourceNode.data.claimedType === 'agent' && params.targetHandle === 'agent')
      ));

    if (!isValid) return;

    takeSnapshot(nodes, edges);

    const isExecLine = params.targetHandle === 'exec-in' ||
      (sourceNode.data?.claimedType === 'execution' && targetNode.type === 'reroute') ||
      (sourceNode.type === 'reroute' && sourceNode.data?.claimedType === 'execution') ||
      sourceNode.type === 'begin';

    const isAgentLine = params.targetHandle === 'agent' ||
      sourceNode.type === 'agent' ||
      (sourceNode.data?.claimedType === 'agent');

    const edgeColor = isAgentLine ? COLORS.agent.primary : COLORS.text.muted;

    const edgeStyle = {
      strokeDasharray: isExecLine ? '6,4' : 'none',
      stroke: edgeColor,
      strokeWidth: 2,
    };

    const edgeMarker = {
      type: MarkerType.ArrowClosed,
      color: edgeColor,
      width: 16,
      height: 16,
    };

    if (sourceNode.type === 'reroute') {
      const newEdge: Edge = {
        id: getId(),
        source: sourceNode.id,
        target: targetNode.id,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
        type: 'default',
        animated: isExecLine,
        style: edgeStyle,
        markerEnd: edgeMarker,
      };
      setEdges(eds => [...eds, newEdge]);
    } else {
      setEdges(eds => addEdge({
        ...params,
        type: 'default',
        animated: isExecLine,
        style: edgeStyle,
        markerEnd: edgeMarker,
      }, eds));
    }
  }, [nodes, edges, takeSnapshot]);

  // Drag & drop
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    let nodeData: Record<string, unknown> = {};
    try {
      const savedData = event.dataTransfer.getData('savedData');
      if (savedData) nodeData = JSON.parse(savedData);
    } catch { /* ignore */ }

    const position = project({
      x: event.clientX - 240,
      y: event.clientY - 48,
    });

    takeSnapshot(nodes, edges);

    const defaults = type === 'agent' ? { ...DEFAULT_AGENT_DATA } : type === 'task' ? { ...DEFAULT_TASK_DATA } : {};
    const newNode: Node = {
      id: getId(),
      type,
      position,
      data: { ...defaults, ...nodeData },
    };

    setNodes(nds => [...nds, newNode]);
    setSelectedNodeId(newNode.id);
  }, [project, nodes, edges, takeSnapshot]);

  // Update node data from properties panel
  const updateNodeData = useCallback((nodeId: string, data: Partial<AgentData | TaskData>) => {
    setNodes(nds => nds.map(n =>
      n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
    ));
    debouncedSnapshot();
  }, [debouncedSnapshot]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (e.key === 'Delete' && !isInput && selectedNodeId) {
        takeSnapshot(nodes, edges);
        setNodes(nds => nds.filter(n => n.id !== selectedNodeId));
        setEdges(eds => eds.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId));
        setSelectedNodeId(null);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setSaveModalOpen(true);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && !isInput) {
        e.preventDefault();
        handleDuplicate();
        return;
      }

      if (e.key === 'Escape') {
        setSelectedNodeId(null);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const state = undo(nodes, edges);
    if (state) {
      setNodes(state.nodes);
      setEdges(state.edges);
    }
  }, [nodes, edges, undo]);

  const handleRedo = useCallback(() => {
    const state = redo(nodes, edges);
    if (state) {
      setNodes(state.nodes);
      setEdges(state.edges);
    }
  }, [nodes, edges, redo]);

  // Duplicate selected node
  const handleDuplicate = useCallback(() => {
    if (!selectedNodeId) return;
    const node = nodes.find(n => n.id === selectedNodeId);
    if (!node || node.type === 'begin') return;

    takeSnapshot(nodes, edges);

    const newNode: Node = {
      ...node,
      id: getId(),
      position: { x: node.position.x + 30, y: node.position.y + 30 },
      data: { ...node.data },
      selected: false,
    };

    setNodes(nds => [...nds, newNode]);
    setSelectedNodeId(newNode.id);
  }, [selectedNodeId, nodes, edges, takeSnapshot]);

  // Save node as template
  const handleSaveSelectedNode = useCallback(() => {
    if (!selectedNode) return;

    if (selectedNode.type === 'agent') {
      const data = selectedNode.data as AgentData;
      if (!data.name) return;
      const newAgent: SavedAgent = { ...data, id: uuidv4() };
      const updated = [...savedAgents.filter(a => a.name !== data.name), newAgent];
      setSavedAgents(updated);
      localStorage.setItem('savedAgents', JSON.stringify(updated));
    } else if (selectedNode.type === 'task') {
      const data = selectedNode.data as TaskData;
      if (!data.name) return;
      const newTask: SavedTask = { ...data, id: uuidv4() };
      const updated = [...savedTasks.filter(t => t.name !== data.name), newTask];
      setSavedTasks(updated);
      localStorage.setItem('savedTasks', JSON.stringify(updated));
    }
  }, [selectedNode, savedAgents, savedTasks]);

  // Graph operations
  const handleNew = useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) return;
    setConfirmModal({
      open: true,
      title: 'New Crew',
      message: 'This will clear the current canvas. Any unsaved changes will be lost.',
      variant: 'warning',
      onConfirm: () => {
        setNodes([]);
        setEdges([]);
        setActiveGraphTitle('Untitled');
        setCrewSettings({ ...DEFAULT_CREW_SETTINGS });
        setSelectedNodeId(null);
        clearHistory();
        setConfirmModal(prev => ({ ...prev, open: false }));
      },
    });
  }, [nodes, edges, clearHistory]);

  const applyTemplate = useCallback((template: CrewTemplate) => {
    const apply = () => {
      const { nodes: tNodes, edges: tEdges, crewSettings: tSettings } = template.build();
      setNodes(tNodes);
      setEdges(tEdges);
      setCrewSettings(tSettings);
      setActiveGraphTitle(tSettings.name);
      setSelectedNodeId(null);
      clearHistory();
      setConfirmModal(prev => ({ ...prev, open: false }));
    };

    if (nodes.length > 0) {
      setConfirmModal({
        open: true,
        title: 'Load Template',
        message: `This will replace the current canvas with the "${template.name}" template. Any unsaved changes will be lost.`,
        variant: 'warning',
        onConfirm: apply,
      });
    } else {
      apply();
    }
  }, [nodes, clearHistory]);

  const handleSave = useCallback((name: string) => {
    const newGraph: SavedGraph = {
      name,
      nodes,
      edges,
      graphName: activeGraphTitle,
      crewSettings,
      savedAt: new Date().toISOString(),
    };
    const updated = [...savedGraphs.filter(g => g.name !== name), newGraph];
    setSavedGraphs(updated);
    localStorage.setItem('savedGraphs', JSON.stringify(updated));
  }, [nodes, edges, activeGraphTitle, crewSettings, savedGraphs]);

  const handleLoad = useCallback((name: string) => {
    const graph = savedGraphs.find(g => g.name === name);
    if (!graph) return;
    const migratedNodes = graph.nodes.map(migrateNodeData);
    setNodes(migratedNodes);
    setEdges(graph.edges);
    setActiveGraphTitle(graph.graphName || 'Untitled');
    setCrewSettings(graph.crewSettings || { ...DEFAULT_CREW_SETTINGS });
    setSelectedNodeId(null);
    clearHistory();
  }, [savedGraphs, clearHistory]);

  const handleDeleteGraph = useCallback((name: string) => {
    const updated = savedGraphs.filter(g => g.name !== name);
    setSavedGraphs(updated);
    localStorage.setItem('savedGraphs', JSON.stringify(updated));
  }, [savedGraphs]);

  const handleDeleteAgent = useCallback((id: string) => {
    const updated = savedAgents.filter(a => a.id !== id);
    setSavedAgents(updated);
    localStorage.setItem('savedAgents', JSON.stringify(updated));
  }, [savedAgents]);

  const handleDeleteTask = useCallback((id: string) => {
    const updated = savedTasks.filter(t => t.id !== id);
    setSavedTasks(updated);
    localStorage.setItem('savedTasks', JSON.stringify(updated));
  }, [savedTasks]);

  // Export
  const agentsYaml = useMemo(() => generateAgentsYaml(nodes, edges), [nodes, edges]);
  const tasksYaml = useMemo(() => generateTasksYaml(nodes, edges), [nodes, edges]);
  const pythonCode = useMemo(() => generatePythonCode(nodes, edges, crewSettings), [nodes, edges, crewSettings]);

  // Edge double-click: insert reroute node
  const onEdgeDoubleClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    const rerouteId = getId();
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return;

    takeSnapshot(nodes, edges);

    const pos = {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: (sourceNode.position.y + targetNode.position.y) / 2,
    };

    const isExecEdge = edge.animated || edge.style?.strokeDasharray;
    const claimedType = isExecEdge ? 'execution' : 'agent';

    setNodes(nds => [...nds, {
      id: rerouteId,
      type: 'reroute',
      position: pos,
      data: { claimedType },
      draggable: true,
    }]);

    setEdges(eds => eds.flatMap(e => {
      if (e.id === edge.id) {
        return [
          { ...e, id: getId(), target: rerouteId, targetHandle: undefined },
          { ...e, id: getId(), source: rerouteId, sourceHandle: undefined },
        ];
      }
      return e;
    }));
  }, [nodes, edges, takeSnapshot]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: COLORS.surface.bg }}>
      <Toolbar
        graphTitle={activeGraphTitle}
        onTitleChange={setActiveGraphTitle}
        onNew={handleNew}
        onSave={() => setSaveModalOpen(true)}
        onLoad={() => setLoadModalOpen(true)}
        onExportYaml={() => { setExportMode('yaml'); setExportModalOpen(true); }}
        onExportPython={() => { setExportMode('python'); setExportModalOpen(true); }}
        onCrewSettings={() => setCrewSettingsOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onSaveSelectedNode={handleSaveSelectedNode}
        hasSelectedNode={!!selectedNode && (selectedNode.type === 'agent' || selectedNode.type === 'task')}
        onDuplicate={handleDuplicate}
        onTemplates={() => setTemplateModalOpen(true)}
      />

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Sidebar
          savedAgents={savedAgents}
          savedTasks={savedTasks}
          onDeleteAgent={handleDeleteAgent}
          onDeleteTask={handleDeleteTask}
        />

        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onPaneClick={onPaneClick}
            onPaneContextMenu={onPaneContextMenu}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Shift"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color={COLORS.surface.border + '40'}
            />
            <Controls
              showInteractive={false}
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                border: `1px solid ${COLORS.surface.border}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'agent') return COLORS.agent.primary;
                if (node.type === 'task') return COLORS.task.primary;
                if (node.type === 'begin') return COLORS.begin.primary;
                return COLORS.text.muted;
              }}
              maskColor={`${COLORS.surface.bg}cc`}
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                border: `1px solid ${COLORS.surface.border}`,
                backgroundColor: COLORS.surface.paper,
              }}
            />
          </ReactFlow>
          {nodes.length === 0 && (
            <WelcomeScreen onSelectTemplate={applyTemplate} />
          )}
        </Box>

        <PropertiesPanel
          selectedNode={selectedNode}
          nodes={nodes}
          edges={edges}
          onUpdateNodeData={updateNodeData}
          onClose={() => setSelectedNodeId(null)}
        />
      </Box>

      {/* Modals */}
      <SaveModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        savedGraphs={savedGraphs}
        currentName={activeGraphTitle}
        onSave={handleSave}
        onDelete={handleDeleteGraph}
      />

      <LoadModal
        open={loadModalOpen}
        onClose={() => setLoadModalOpen(false)}
        savedGraphs={savedGraphs}
        onLoad={handleLoad}
        onDelete={handleDeleteGraph}
      />

      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        agentsYaml={agentsYaml}
        tasksYaml={tasksYaml}
        pythonCode={pythonCode}
        mode={exportMode}
      />

      <CrewSettingsModal
        open={crewSettingsOpen}
        onClose={() => setCrewSettingsOpen(false)}
        settings={crewSettings}
        onUpdate={setCrewSettings}
      />

      <TemplateModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSelectTemplate={(t) => { setTemplateModalOpen(false); applyTemplate(t); }}
      />

      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, open: false }))}
      />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </ThemeProvider>
  );
}

export default App;
