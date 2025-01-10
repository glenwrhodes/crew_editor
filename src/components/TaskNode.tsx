import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

interface TaskData {
  label?: string;
  description?: string;
  priority?: string;
  expectedOutput?: string;
  context?: string;
  tools?: string;
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
        maxWidth: 200,
        border: isSelected ? '2px solid white' : 'none',
      }}
      onClick={handleSelect}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          Task
        </Typography>
        
        <TextField
          label="Description"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={2}
          value={data.description || ''}
          onChange={(e) => data.onChange?.('description', e.target.value)}
          sx={{ mt: 1 }}
        />

        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            label="Priority"
            value={data.priority || '0'}
            onChange={(e) => data.onChange?.('priority', e.target.value)}
          >
            <MenuItem value="0">Low</MenuItem>
            <MenuItem value="1">Medium</MenuItem>
            <MenuItem value="2">High</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Expected Output"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={2}
          value={data.expectedOutput || ''}
          onChange={(e) => data.onChange?.('expectedOutput', e.target.value)}
          sx={{ mt: 1 }}
        />

        <TextField
          label="Context"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={2}
          value={data.context || ''}
          onChange={(e) => data.onChange?.('context', e.target.value)}
          sx={{ mt: 1 }}
        />

        <TextField
          label="Tools"
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Comma-separated list of tools"
          value={data.tools || ''}
          onChange={(e) => data.onChange?.('tools', e.target.value)}
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
          <Handle type="source" position={Position.Right} id="exec-out" style={{ background: 'white', borderRadius: '50%', width: 14, height: 14, border: '2px solid #555' }} />
        </Box>
        <Box sx={{ position: 'absolute', top: '60%', left: 0, transform: 'translateY(-50%)' }}>
          <Handle 
            type="target" 
            position={Position.Left} 
            id="agent"
            style={{ background: 'yellow', borderRadius: '50%', width: 14, height: 14, border: '2px solid #555' }}
          />
        </Box>
        <Box sx={{ position: 'absolute', top: '60%', right: 0, transform: 'translateY(-50%)' }}>
          <Handle 
            type="source" 
            position={Position.Right} 
            id="agent-out"
            style={{ background: 'yellow', borderRadius: '50%', width: 14, height: 14, border: '2px solid #555' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(TaskNode); 