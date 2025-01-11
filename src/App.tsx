import { useState, useCallback, DragEvent, useEffect, useMemo } from 'react';
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
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AppBar, Toolbar, Typography, Button, Box, ThemeProvider, createTheme, CssBaseline, Dialog, DialogTitle, DialogContent, TextField, List, ListItem, ListItemText, IconButton, Tooltip } from '@mui/material';
import TaskNode from './components/TaskNode';
import AgentNode from './components/AgentNode';
import Sidebar from './components/Sidebar';
import BeginNode from './components/BeginNode';
import RerouteNode from './components/RerouteNode';
import SaveIcon from '@mui/icons-material/Save';
import LoadIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import './App.css';
import { TaskData } from './components/TaskNode';
import { AgentData } from './components/AgentNode';
import { v4 as uuidv4 } from 'uuid';

const getId = () => `node_${uuidv4()}`;

// Define Agent and Task types to match Sidebar's requirements
interface Agent extends AgentData {
  name: string;
}

interface Task extends TaskData {
  name: string;
}

function Flow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);
  const [yamlContent, setYamlContent] = useState('');
  const [pythonDialogOpen, setPythonDialogOpen] = useState(false);
  const [pythonContent, setPythonContent] = useState('');
  const [graphName, setGraphName] = useState('');
  const [savedGraphs, setSavedGraphs] = useState<{ name: string; nodes: Node[]; edges: Edge[]; graphName: string }[]>([]);
  const { project } = useReactFlow();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [activeGraphTitle, setActiveGraphTitle] = useState('Untitled');
  const [selectedGraphName, setSelectedGraphName] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [savedAgents, setSavedAgents] = useState<Agent[]>([]);
  const [savedTasks, setSavedTasks] = useState<Task[]>([]);

  const nodeTypes = useMemo(() => ({
    task: (props: NodeProps<TaskData>) => <TaskNode {...props} onSave={() => {}} updateSavedTasks={(tasks) => setSavedTasks(tasks as Task[])} />,
    agent: (props: NodeProps<AgentData>) => <AgentNode {...props} onSave={() => {}} updateSavedAgents={(agents) => setSavedAgents(agents as Agent[])} />,
    begin: BeginNode,
    reroute: RerouteNode,
  }), [setSavedTasks, setSavedAgents]);

  useEffect(() => {
    const saved = localStorage.getItem('savedGraphs');
    if (saved) {
      setSavedGraphs(JSON.parse(saved));
    }
  }, []);

  const saveGraph = () => {
    if (!graphName) return alert('Please enter a name for the file.');
    const newGraph = { name: graphName, nodes, edges, graphName: activeGraphTitle };
    const updatedGraphs = [...savedGraphs.filter(g => g.name !== graphName), newGraph];
    setSavedGraphs(updatedGraphs);
    localStorage.setItem('savedGraphs', JSON.stringify(updatedGraphs));
  };

  const loadGraph = (name: string) => {
    const graph = savedGraphs.find(g => g.name === name);
    if (graph) {
      setNodes(graph.nodes);
      setEdges(graph.edges);
      setActiveGraphTitle(graph.graphName);
    }
  };

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
      // Remove any edges connected to the deleted node
      setEdges((eds) => eds.filter(edge => 
        edge.source !== selectedNodeId && edge.target !== selectedNodeId
      ));
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
      
      if (!sourceNode || !targetNode || !params.source || !params.target) return;

      // Handle reroute node type claiming
      if (targetNode.type === 'reroute') {
        const isExecutionConnection = sourceNode.type === 'begin' || 
          (sourceNode.type === 'task' && params.sourceHandle === 'exec-out');
        const isAgentConnection = sourceNode.type === 'agent' || 
          (sourceNode.type === 'task' && params.sourceHandle === 'agent-out');

        // Update reroute node type if not already claimed
        if (!targetNode.data.claimedType) {
          setNodes(nds => nds.map(node => {
            if (node.id === targetNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  claimedType: isExecutionConnection ? 'execution' : isAgentConnection ? 'agent' : undefined
                }
              };
            }
            return node;
          }));
        }
      }

      // Define valid connections
      const isValid = (
        // Agent can connect to Task's agent input
        (sourceNode.type === 'agent' && targetNode.type === 'task' && params.targetHandle === 'agent') ||
        // Task can connect to Task's execution input
        (sourceNode.type === 'task' && targetNode.type === 'task' && params.targetHandle === 'exec-in') ||
        // Begin can connect to Task's execution input
        (sourceNode.type === 'begin' && targetNode.type === 'task' && params.targetHandle === 'exec-in') ||
        // Any node can connect to reroute node
        (targetNode.type === 'reroute') ||
        // Reroute node can connect to matching type inputs
        (sourceNode.type === 'reroute' && (
          (sourceNode.data.claimedType === 'execution' && params.targetHandle === 'exec-in') ||
          (sourceNode.data.claimedType === 'agent' && params.targetHandle === 'agent')
        ))
      );
      
      if (isValid) {
        const isExecutionLine = params.targetHandle === 'exec-in' || 
          (sourceNode.data?.claimedType === 'execution' && targetNode.type === 'reroute') ||
          (sourceNode.type === 'reroute' && sourceNode.data?.claimedType === 'execution');

        const edgeStyle = {
          strokeDasharray: isExecutionLine ? '5,5' : 'none',
          stroke: isExecutionLine ? 'white' : 'yellow',
          strokeWidth: 2,
        };

        const edgeMarker = {
          type: MarkerType.ArrowClosed,
          color: isExecutionLine ? 'white' : 'yellow',
          width: 20,
          height: 20,
        };

        // For reroute nodes, preserve existing connections and add the new one
        if (sourceNode.type === 'reroute') {
          setEdges(eds => {
            // Keep all existing connections when adding a new one from a reroute node
            const newConnection: Edge = {
              id: getId(),
              source: sourceNode.id,
              target: targetNode.id,
              sourceHandle: params.sourceHandle || undefined,
              targetHandle: params.targetHandle || undefined,
              type: 'default',
              animated: isExecutionLine,
              style: edgeStyle,
              markerEnd: edgeMarker,
            };
            return [...eds, newConnection];
          });
        } else {
          setEdges((eds) => addEdge({
            ...params,
            type: 'default',
            animated: isExecutionLine,
            style: edgeStyle,
            markerEnd: edgeMarker,
          }, eds));
        }
      }
    },
    [nodes]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onChange = (nodeId: string, field: string, value: string) => {
    setNodes(nds => 
      nds.map(node => {
        if (node.id === nodeId) {
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
  };

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const savedData = event.dataTransfer.getData('savedData');
      const nodeData = savedData ? JSON.parse(savedData) : {};
      console.log('Loading Node Data:', nodeData);

      const position = project({
        x: event.clientX - 200,  // Adjust for sidebar width
        y: event.clientY - 64,   // Adjust for header height
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { 
          ...nodeData,
          label: nodeData.label || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
          onChange: (field: string, value: string) => onChange(newNode.id, field, value),
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

  const handleYamlExport = () => {
    const agentsYaml = nodes.filter(n => n.type === 'agent').map(agent => {
      const { name, role, goal, backstory } = agent.data;
      return `${name}:
  role: >
    ${role}
  goal: >
    ${goal}
  backstory: >
    ${backstory}`;
    }).join('\n\n');

    const tasksYaml = nodes.filter(n => n.type === 'task').map(task => {
      const { name, description, expected_output } = task.data;
      const connectedAgent = edges.find(e => e.target === task.id && nodes.find(n => n.id === e.source)?.type === 'agent');
      const agentName = connectedAgent ? nodes.find(n => n.id === connectedAgent.source)?.data.name : 'None';
      return `${name}:
  description: >
    ${description}
  expected_output: >
    ${expected_output}
  agent: ${agentName}`;
    }).join('\n\n');

    setYamlContent(`Agents:\n\n${agentsYaml}\n\nTasks:\n\n${tasksYaml}`);
    setYamlDialogOpen(true);
  };

  const handlePythonExport = () => {
    const agentsCode = nodes.filter(n => n.type === 'agent').map(agent => {
      const { name, tools } = agent.data;
      const safeName = name?.replace(/\s+/g, '_');
      const toolsArray = tools ? tools.split(',').map((tool: string) => tool.trim()).filter((tool: string) => tool.length > 0) : [];
      const toolsCode = toolsArray.map((tool: string) => `${tool}()`).join(', ');
      return `@agent\ndef ${safeName}() -> Agent:\n    return Agent(\n        config=self.agents_config['${name}'],\n        verbose=True,\n        tools=[${toolsCode}]\n    )`;
    }).join('\n\n');

    const getTaskOrder = () => {
      const beginNode = nodes.find(n => n.type === 'begin');
      if (!beginNode) return [];

      const orderedTasks: string[] = [];
      const visited = new Set<string>();

      const dfs = (nodeId: string) => {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        const outgoingEdges = edges.filter(e => e.source === nodeId && nodes.find(n => n.id === e.target)?.type === 'task');
        outgoingEdges.forEach(edge => {
          const targetNode = nodes.find(n => n.id === edge.target);
          if (targetNode && targetNode.type === 'task') {
            orderedTasks.push(targetNode.data.name?.replace(/\s+/g, '_') || '');
            dfs(targetNode.id);
          }
        });
      };

      dfs(beginNode.id);

      // Add unconnected tasks at the end
      const unconnectedTasks = nodes.filter(n => n.type === 'task' && !visited.has(n.id)).map(n => n.data.name?.replace(/\s+/g, '_') || '');
      return [...orderedTasks, ...unconnectedTasks];
    };

    const taskOrder = getTaskOrder();

    const tasksCode = taskOrder.map(safeName => {
      const taskNode = nodes.find(n => n.data.name?.replace(/\s+/g, '_') === safeName);
      if (!taskNode) return '';

      const contextTasks = edges
        .filter(e => e.target === taskNode.id && nodes.find(n => n.id === e.source)?.type === 'task')
        .map(e => nodes.find(n => n.id === e.source)?.data.name?.replace(/\s+/g, '_'))
        .filter((name): name is string => !!name);
      const contextCode = contextTasks.length > 0 ? `,\n        context=[${contextTasks.map(ct => `self.${ct}()`).join(', ')}]` : '';
      return `@task\ndef ${safeName}() -> Task:\n    return Task(\n        config=self.tasks_config['${taskNode.data.name}'],\n        output_file='${safeName}.md'${contextCode}\n    )`;
    }).join('\n\n');

    const crewCode = `@crew\ndef crew() -> Crew:\n    return Crew(\n        agents=self.agents,\n        tasks=self.tasks,\n        process=Process.sequential,\n        verbose=True\n    )`;

    setPythonContent(`# Generated crew.py\n\nfrom crewai import Agent, Crew, Process, Task\nfrom crewai.project import CrewBase, agent, crew, task, before_kickoff\nimport os\n\n@CrewBase\nclass GeneratedCrew():\n    agents_config = 'config/agents.yaml'\n    tasks_config = 'config/tasks.yaml'\n\n${agentsCode}\n\n${tasksCode}\n\n${crewCode}`);
    setPythonDialogOpen(true);
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

  const newGraph = () => {
    setNodes([]);
    setEdges([]);
    setActiveGraphTitle('Untitled');
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {isEditingTitle ? (
              <TextField
                value={activeGraphTitle}
                onChange={(e) => setActiveGraphTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                sx={{ width: '100%' }}
              />
            ) : (
              <span onClick={() => setIsEditingTitle(true)} style={{ cursor: 'pointer' }}>
                {activeGraphTitle} - CrewAI Visual Editor
              </span>
            )}
          </Typography>
          <Tooltip title="New Graph">
            <IconButton color="inherit" onClick={newGraph} sx={{ mr: 2 }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="YAML Export">
            <Button color="inherit" onClick={handleYamlExport} sx={{ mr: 2 }}>
              YAML Export
            </Button>
          </Tooltip>
          <Tooltip title="Python Export">
            <Button color="inherit" onClick={handlePythonExport} sx={{ mr: 2 }}>
              Python Export
            </Button>
          </Tooltip>
          <Tooltip title="Save Graph">
            <Button color="inherit" onClick={() => setSaveDialogOpen(true)} sx={{ mr: 2 }}>
              <SaveIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Load Graph">
            <Button color="inherit" onClick={() => setLoadDialogOpen(true)} sx={{ mr: 2 }}>
              <LoadIcon />
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar savedAgents={savedAgents} savedTasks={savedTasks} setSavedAgents={setSavedAgents} setSavedTasks={setSavedTasks} />
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
      <Dialog open={yamlDialogOpen} onClose={() => setYamlDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>YAML Export</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={20}
            value={yamlContent}
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={pythonDialogOpen} onClose={() => setPythonDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Python Export</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={20}
            value={pythonContent}
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Save File</DialogTitle>
        <DialogContent>
          <TextField
            label="File Name"
            variant="outlined"
            fullWidth
            value={graphName}
            onChange={(e) => setGraphName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {savedGraphs.map((graph) => (
              <ListItem key={graph.name} component="div">
                <ListItemText primary={graph.name} />
                <IconButton edge="end" aria-label="overwrite" onClick={() => {
                  if (window.confirm(`Overwrite ${graph.name}?`)) {
                    saveGraph();
                    setSaveDialogOpen(false);
                  }
                }}>
                  <SaveIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              saveGraph();
              setSaveDialogOpen(false);
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={loadDialogOpen} onClose={() => setLoadDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Load File</DialogTitle>
        <DialogContent>
          <List>
            {savedGraphs.map((graph) => (
              <ListItem key={graph.name} component="div" onClick={() => setSelectedGraphName(graph.name)} style={{ cursor: 'pointer' }}>
                <ListItemText primary={graph.name} />
              </ListItem>
            ))}
          </List>
          <TextField
            label="Selected File"
            variant="outlined"
            fullWidth
            value={selectedGraphName}
            onChange={(e) => setSelectedGraphName(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              loadGraph(selectedGraphName);
              setLoadDialogOpen(false);
            }}
          >
            Load
          </Button>
        </DialogContent>
      </Dialog>
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
