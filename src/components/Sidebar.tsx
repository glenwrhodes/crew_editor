import { Box, Paper, Typography, Divider } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import StartIcon from '@mui/icons-material/Start';

const DraggableNode = ({ type, label, icon }: { type: string; label: string; icon: React.ReactNode }) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
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
      <Typography>{label}</Typography>
    </Box>
  );
};

const Sidebar = () => {
  return (
    <Paper 
      sx={{ 
        width: 200, 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
      elevation={3}
    >
      <Typography variant="h6">Node Types</Typography>
      <Divider />
      
      <DraggableNode 
        type="begin" 
        label="Begin Node" 
        icon={<StartIcon color="action" />} 
      />

      <DraggableNode 
        type="agent" 
        label="Agent Node" 
        icon={<PersonIcon color="primary" />} 
      />

      <DraggableNode 
        type="task" 
        label="Task Node" 
        icon={<AssignmentIcon color="secondary" />} 
      />

    </Paper>
  );
};

export default Sidebar; 