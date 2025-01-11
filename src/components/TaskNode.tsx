import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, TextField, Box } from '@mui/material';

interface TaskData {
  name?: string;
  description?: string;
  expected_output?: string;
  onChange?: (field: string, value: string) => void;
}

const TaskNode = ({ data }: NodeProps<TaskData>) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected(!isSelected);
  };

  return (
    <Card
      sx={{
        minWidth: 300,
        position: 'relative',
        overflow: 'visible',
        maxWidth: 300,
        bgcolor: isSelected ? '#444' : '#333',
        border: isSelected ? '2px solid white' : 'none',
      }}
      onClick={handleSelect}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          Task
        </Typography>
        
        <TextField
          label="Name"
          variant="outlined"
          size="small"
          fullWidth
          value={data.name || ''}
          onChange={(e) => data.onChange?.('name', e.target.value)}
          sx={{ mt: 1 }}
        />

        <TextField
          label="Description"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={4}
          value={data.description || ''}
          onChange={(e) => data.onChange?.('description', e.target.value)}
          sx={{ mt: 1 }}
        />

        <TextField
          label="Expected Output"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={4}
          value={data.expected_output || ''}
          onChange={(e) => data.onChange?.('expected_output', e.target.value)}
          sx={{ mt: 1 }}
        />

        <Box sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)' }}>
          <Handle 
            type="target" 
            position={Position.Left} 
            id="exec-in"
            style={{ background: 'white', borderRadius: '50%', width: 14, height: 14, border: '2px solid #555' }}
          />
        </Box>
        <Box sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}>
          <Handle 
            type="source" 
            position={Position.Right} 
            id="exec-out" 
            style={{ background: 'white', borderRadius: '50%', width: 14, height: 14, border: '2px solid #555' }} 
          />
        </Box>
        <Box sx={{ position: 'absolute', top: '60%', left: 0, transform: 'translateY(-50%)' }}>
          <Handle 
            type="target" 
            position={Position.Left} 
            id="agent"
            style={{ background: 'yellow', borderRadius: '50%', width: 14, height: 14, border: '2px solid #555' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(TaskNode); 