import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, TextField, Box, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

export interface AgentData {
  name?: string;
  role?: string;
  goal?: string;
  backstory?: string;
  tools?: string;
  onChange?: (field: string, value: string) => void;
}

const AgentNode = ({ data, onSave, updateSavedAgents }: NodeProps<AgentData> & { onSave: (agent: AgentData) => void, updateSavedAgents: (agents: AgentData[]) => void }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected(!isSelected);
  };

  const handleSave = () => {
    console.log('Saving Agent Data:', data);
    const savedAgents = JSON.parse(localStorage.getItem('savedAgents') || '[]');
    savedAgents.push(data);
    localStorage.setItem('savedAgents', JSON.stringify(savedAgents));
    console.log('Stored Agents in localStorage:', JSON.parse(localStorage.getItem('savedAgents') || '[]'));
    updateSavedAgents(savedAgents);
    onSave(data);
  };

  return (
    <Card
      sx={{
        minWidth: 300,
        position: 'relative',
        overflow: 'visible',
        maxWidth: 300,
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

        <TextField
          label="Role"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={2}
          value={data.role || ''}
          onChange={(e) => data.onChange?.('role', e.target.value)}
          sx={{ mt: 1 }}
        />

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
          rows={3}
          value={data.backstory || ''}
          onChange={(e) => data.onChange?.('backstory', e.target.value)}
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

        <Box sx={{ position: 'absolute', top: '50%', right: -7, transform: 'translateY(-50%)' }}>
          <Handle 
            type="source" 
            position={Position.Right} 
            id="agent-out"
            style={{ background: 'yellow', borderRadius: '50%', width: 14, height: 14, border: '2px solid #555' }}
          />
        </Box>

        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton onClick={handleSave} size="small" color="primary">
            <SaveIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(AgentNode); 