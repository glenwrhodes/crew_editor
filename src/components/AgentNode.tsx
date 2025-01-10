import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

interface AgentData {
  label?: string;
  name?: string;
  role?: string;
  goal?: string;
  backstory?: string;
  memory?: string;
  verbose?: string;
  tools?: string;
  onChange?: (field: string, value: string) => void;
}

const AgentNode = ({ data }: NodeProps<AgentData>) => {
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
        bgcolor: isSelected ? '#334' : '#221',
        border: isSelected ? '2px solid white' : 'none',
      }}
      onClick={handleSelect}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          Agent
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

        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            value={data.role || ''}
            onChange={(e) => data.onChange?.('role', e.target.value)}
          >
            <MenuItem value="researcher">Researcher</MenuItem>
            <MenuItem value="writer">Writer</MenuItem>
            <MenuItem value="analyst">Analyst</MenuItem>
            <MenuItem value="developer">Developer</MenuItem>
            <MenuItem value="reviewer">Reviewer</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Goal"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={2}
          value={data.goal || ''}
          onChange={(e) => data.onChange?.('goal', e.target.value)}
          sx={{ mt: 1 }}
        />

        <TextField
          label="Backstory"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={2}
          value={data.backstory || ''}
          onChange={(e) => data.onChange?.('backstory', e.target.value)}
          sx={{ mt: 1 }}
        />

        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel>Memory</InputLabel>
          <Select
            label="Memory"
            value={data.memory || 'none'}
            onChange={(e) => data.onChange?.('memory', e.target.value)}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="short_term">Short Term</MenuItem>
            <MenuItem value="long_term">Long Term</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel>Verbose</InputLabel>
          <Select
            label="Verbose"
            value={data.verbose || 'false'}
            onChange={(e) => data.onChange?.('verbose', e.target.value)}
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>

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

        <Box sx={{ position: 'absolute', top: '50%', right: -7, transform: 'translateY(-50%)' }}>
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

export default memo(AgentNode); 