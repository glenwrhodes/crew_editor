import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography } from '@mui/material';

const BeginNode = ({ data }: NodeProps) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected(!isSelected);
  };

  return (
    <Card
      sx={{
        minWidth: 100,
        bgcolor: '#2e2e2e',
        position: 'relative',
        overflow: 'visible',
        color: '#ffffff',
        border: isSelected ? '2px solid white' : 'none',
      }}
      onClick={handleSelect}
    >
      <CardContent>
        <Typography variant="h8" component="div">
          Begin
        </Typography>
        <Handle type="source" position={Position.Right} id="exec-out" style={{ background: 'white', borderRadius: '50%', width: 14, height: 14, border: '2px solid #555', top: '50%', transform: 'translateY(-50%)' }} />
      </CardContent>
    </Card>
  );
};

export default memo(BeginNode); 