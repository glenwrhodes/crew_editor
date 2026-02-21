import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { COLORS } from '../../theme';

interface RerouteNodeData {
  claimedType?: 'execution' | 'agent';
}

const RerouteNode = ({ data }: NodeProps<RerouteNodeData>) => {
  const color = data.claimedType === 'execution'
    ? COLORS.text.secondary
    : data.claimedType === 'agent'
      ? COLORS.agent.primary
      : COLORS.text.muted;

  const borderColor = data.claimedType === 'execution'
    ? COLORS.surface.elevated
    : data.claimedType === 'agent'
      ? COLORS.agent.dark
      : COLORS.surface.border;

  return (
    <div
      aria-label="Reroute node"
      style={{
        width: 12,
        height: 12,
        backgroundColor: color,
        borderRadius: '50%',
        border: `2px solid ${borderColor}`,
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: 'transparent',
          border: 'none',
          width: 8,
          height: 8,
          left: -4,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'transparent',
          border: 'none',
          width: 8,
          height: 8,
          right: -4,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  );
};

export default memo(RerouteNode);
