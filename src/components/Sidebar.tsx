import { Box, Paper, Typography, Divider, IconButton } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import StartIcon from '@mui/icons-material/Start';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';

interface Agent {
  name: string;
  role?: string;
  goal?: string;
  backstory?: string;
  tools?: string;
  onChange?: (field: string, value: string) => void;
}

interface Task {
  name: string;
  description?: string;
  expected_output?: string;
  onChange?: (field: string, value: string) => void;
}

const DraggableNode = ({ type, label, icon, savedAgents, savedTasks }: { type: string; label: string; icon: React.ReactNode; savedAgents: Agent[]; savedTasks: Task[] }) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
    const savedData = type === 'agent' ? savedAgents.find(agent => agent.name === label) : savedTasks.find(task => task.name === label);
    if (savedData) {
      event.dataTransfer.setData('savedData', JSON.stringify(savedData));
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box
      sx={{
        p: 2,
        border: '1px dashed grey',
        borderRadius: 1,
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
      draggable
      onDragStart={onDragStart}
    >
      {icon}
      <Typography noWrap sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{label}</Typography>
    </Box>
  );
};

const Sidebar = ({ savedAgents, savedTasks, setSavedAgents, setSavedTasks }: { savedAgents: Agent[]; savedTasks: Task[]; setSavedAgents: (agents: Agent[]) => void; setSavedTasks: (tasks: Task[]) => void; }) => {
  const refreshSavedItems = () => {
    const agents = JSON.parse(localStorage.getItem('savedAgents') || '[]');
    const tasks = JSON.parse(localStorage.getItem('savedTasks') || '[]');
    setSavedAgents(agents);
    setSavedTasks(tasks);
  };

  useEffect(() => {
    refreshSavedItems();
  }, []);

  const handleDeleteAgent = (name: string) => {
    const updatedAgents = savedAgents.filter(agent => agent.name !== name);
    setSavedAgents(updatedAgents);
    localStorage.setItem('savedAgents', JSON.stringify(updatedAgents));
  };

  const handleDeleteTask = (name: string) => {
    const updatedTasks = savedTasks.filter(task => task.name !== name);
    setSavedTasks(updatedTasks);
    localStorage.setItem('savedTasks', JSON.stringify(updatedTasks));
  };

  const onDragStart = (event: React.DragEvent, type: string, name: string) => {
    event.dataTransfer.setData('application/reactflow', type);
    const savedData = type === 'agent' ? savedAgents.find(agent => agent.name === name) : savedTasks.find(task => task.name === name);
    if (savedData) {
      event.dataTransfer.setData('savedData', JSON.stringify(savedData));
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Paper 
      sx={{ 
        width: 200, 
        p: 2,
        overflowY: 'auto',
        maxHeight: '100vh'
      }}
    >
      <Typography variant="h6">Saved Agents</Typography>
      {savedAgents.map((agent, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px dashed grey', borderRadius: 1, p: 2, mb: 1, cursor: 'grab' }} draggable onDragStart={(event) => onDragStart(event, 'agent', agent.name)}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: '120px' }}>
            <PersonIcon />
            <Typography noWrap sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{agent.name || 'Unnamed Agent'}</Typography>
          </Box>
          <IconButton onClick={() => handleDeleteAgent(agent.name)} size="small" color="secondary">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Saved Tasks</Typography>
      {savedTasks.map((task, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px dashed grey', borderRadius: 1, p: 2, mb: 1, cursor: 'grab' }} draggable onDragStart={(event) => onDragStart(event, 'task', task.name)}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: '120px' }}>
            <AssignmentIcon />
            <Typography noWrap sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{task.name || 'Unnamed Task'}</Typography>
          </Box>
          <IconButton onClick={() => handleDeleteTask(task.name)} size="small" color="secondary">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Nodes</Typography>
      <Divider />
      <DraggableNode 
        type="begin" 
        label="Begin Node" 
        icon={<StartIcon color="action" />} 
        savedAgents={savedAgents} 
        savedTasks={savedTasks} 
      />

      <DraggableNode 
        type="agent" 
        label="Agent Node" 
        icon={<PersonIcon color="primary" />} 
        savedAgents={savedAgents} 
        savedTasks={savedTasks} 
      />

      <DraggableNode 
        type="task" 
        label="Task Node" 
        icon={<AssignmentIcon color="secondary" />} 
        savedAgents={savedAgents} 
        savedTasks={savedTasks} 
      />

    </Paper>
  );
};

export default Sidebar; 