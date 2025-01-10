import { useState, useCallback, DragEvent, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  useReactFlow,
  ReactFlowProvider,
  addEdge,
  MarkerType,
  Position,
  Handle
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AppBar, Toolbar, Typography, Button, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import TaskNode from './components/TaskNode';
import AgentNode from './components/AgentNode';
import Sidebar from './components/Sidebar';
import BeginNode from './components/BeginNode';
import './App.css';

const nodeTypes = {
  task: TaskNode,
  agent: AgentNode,
  begin: BeginNode,
  reroute: () => (
    <div style={{ width: 10, height: 10, backgroundColor: 'gray', borderRadius: '50%', position: 'relative' }}>
      <Handle type="target" position={Position.Left} style={{ background: 'white', borderRadius: '50%', width: 6, height: 6, top: '50%', transform: 'translateY(-50%)' }} />
      <Handle type="source" position={Position.Right} style={{ background: 'white', borderRadius: '50%', width: 6, height: 6, top: '50%', transform: 'translateY(-50%)' }} />
    </div>
  ),
};

let id = 0;
const getId = () => `node_${id++}`;

function Flow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { project } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      // Implement a different approach to track selected nodes
    },
    []
  );

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' && selectedNodeId) {
      setNodes((nds) => nds.filter(node => node.id !== selectedNodeId));
      setSelectedNodeId(null);
    }
  }, [selectedNodeId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) return;

      // Define valid connections
      const isValid = (
        // Agent can connect to Task's agent input
        (sourceNode.type === 'agent' && targetNode.type === 'task' && params.targetHandle === 'agent') ||
        // Task can connect to Task's execution input
        (sourceNode.type === 'task' && targetNode.type === 'task' && params.targetHandle === 'exec-in') ||
        // Begin can connect to Task's execution input
        (sourceNode.type === 'begin' && targetNode.type === 'task' && params.targetHandle === 'exec-in')
      );
      
      if (isValid) {
        const isExecutionLine = params.targetHandle === 'exec-in';
        setEdges((eds) => addEdge({
          ...params,
          type: 'default',
          animated: isExecutionLine,
          style: {
            strokeDasharray: isExecutionLine ? '5,5' : 'none',
            stroke: isExecutionLine ? 'white' : 'yellow',
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isExecutionLine ? 'white' : 'yellow',
            width: 20,
            height: 20,
          },
        }, eds));
      }
    },
    [nodes]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      // Only allow one execution node
      if (type === 'execution' && nodes.some(n => n.type === 'execution')) {
        return;
      }

      const position = project({
        x: event.clientX - 200,  // Adjust for sidebar width
        y: event.clientY - 64,   // Adjust for header height
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
          onChange: (field: string, value: string) => {
            setNodes(nds => 
              nds.map(node => {
                if (node.id === newNode.id) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      [field]: value,
                    },
                  };
                }
                return node;
              })
            );
          },
          onExecute: type === 'execution' ? handleRunCrew : undefined
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [project]
  );

  const handleRunCrew = () => {
    // Get all tasks and their connections
    const tasks = nodes.filter(n => n.type === 'task');
    const taskConnections = edges.filter(e => {
      const source = nodes.find(n => n.id === e.source);
      const target = nodes.find(n => n.id === e.target);
      return source?.type === 'task' && target?.type === 'task';
    });

    // Get agent assignments
    const agentAssignments = edges.filter(e => {
      const source = nodes.find(n => n.id === e.source);
      const target = nodes.find(n => n.id === e.target);
      return source?.type === 'agent' && target?.type === 'task';
    });

    console.log('Running crew...', {
      tasks: tasks.map(t => ({
        id: t.id,
        ...t.data
      })),
      taskFlow: taskConnections,
      agentAssignments: agentAssignments.map(a => ({
        agentId: a.source,
        taskId: a.target
      }))
    });
  };

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const onEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();

    const rerouteNodeId = getId();
    const rerouteNodePosition = project({
      x: event.clientX,
      y: event.clientY,
    });

    const rerouteNode: Node = {
      id: rerouteNodeId,
      type: 'reroute',
      position: rerouteNodePosition,
      data: {},
      draggable: true,
      style: {
        width: 10,
        height: 10,
        backgroundColor: 'gray',
        borderRadius: '50%',
      },
    };

    setNodes((nds) => [...nds, rerouteNode]);

    setEdges((eds) => eds.flatMap((e) => {
      if (e.id === edge.id) {
        return [
          { ...e, target: rerouteNodeId },
          { ...e, id: getId(), source: rerouteNodeId, target: e.target },
        ];
      }
      return e;
    }));
  }, [setNodes, setEdges, project]);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);

  const onPaneMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button !== 2) return; // Only allow right-click drag
    event.preventDefault();
    // Start custom drag logic here
  }, []);

  const onPaneMouseUp = useCallback((event: React.MouseEvent) => {
    if (event.button !== 2) return; // Only handle right-click release
    event.preventDefault();
    // End custom drag logic here
  }, []);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CrewAI Visual Editor
          </Typography>
          <Button color="inherit" onClick={handleRunCrew}>
            Run Crew
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
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
            onMouseDown={onPaneMouseDown}
            onMouseUp={onPaneMouseUp}
            onEdgeDoubleClick={onEdgeDoubleClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </Box>
      </Box>
    </Box>
  );
}

// Apply dark theme styles
const darkTheme = {
  palette: {
    mode: 'dark' as const,
    background: {
      default: '#1e1e1e',
      paper: '#2e2e2e',
    },
    text: {
      primary: '#ffffff',
    },
  },
};

function App() {
  return (
    <ThemeProvider theme={createTheme(darkTheme)}>
      <CssBaseline />
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </ThemeProvider>
  );
}

export default App;
