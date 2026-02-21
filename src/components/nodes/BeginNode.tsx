import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Typography } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { COLORS } from '../../theme';

const BeginNode = (_props: NodeProps) => {
  return (
    <Box
      aria-label="Begin node - execution start point"
      sx={{
        minWidth: 100,
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${COLORS.begin.border}50`,
        bgcolor: COLORS.begin.bg,
        boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
        transition: 'all 0.15s ease',
        '&:hover': {
          border: `1px solid ${COLORS.begin.border}90`,
          boxShadow: `0 0 16px ${COLORS.begin.primary}15`,
        },
        position: 'relative',
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 0.6,
          bgcolor: COLORS.begin.headerBg,
          borderBottom: `1px solid ${COLORS.begin.border}30`,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <PlayArrowRoundedIcon sx={{ fontSize: 14, color: COLORS.begin.primary }} />
        <Typography
          variant="caption"
          sx={{
            color: COLORS.begin.primary,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontSize: '0.6rem',
          }}
        >
          Start
        </Typography>
      </Box>

      <Box sx={{ px: 1.5, py: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography
          variant="caption"
          sx={{ color: COLORS.text.muted, fontSize: '0.65rem' }}
        >
          Execution begins here
        </Typography>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        id="exec-out"
        style={{
          background: COLORS.text.secondary,
          borderRadius: '50%',
          width: 12,
          height: 12,
          border: `2px solid ${COLORS.surface.elevated}`,
          right: -6,
        }}
      />
    </Box>
  );
};

export default memo(BeginNode);
