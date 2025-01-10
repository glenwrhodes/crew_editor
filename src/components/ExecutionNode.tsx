import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface ExecutionData {
  label?: string;
  onExecute?: () => void;
}

const ExecutionNode = ({ data }: NodeProps<ExecutionData>) => {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Handle type="target" position={Position.Top} />
        <Typography variant="h6" component="div">
          Execution
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon />}
          fullWidth
          onClick={() => data.onExecute?.()}
          sx={{ mt: 1 }}
        >
          Execute Flow
        </Button>
      </CardContent>
    </Card>
  );
};

export default memo(ExecutionNode); 