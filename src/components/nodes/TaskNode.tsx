import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Typography, Chip, Stack } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { TaskData } from '../../types';
import { COLORS } from '../../theme';

const TaskNode = ({ data, selected }: NodeProps<TaskData>) => {
  return (
    <Box
      aria-label={`Task node: ${data.name || 'Unnamed Task'}`}
      sx={{
        minWidth: 220,
        maxWidth: 260,
        borderRadius: '12px',
        overflow: 'hidden',
        border: selected
          ? `2px solid ${COLORS.task.primary}`
          : `1px solid ${COLORS.task.border}40`,
        bgcolor: COLORS.task.bg,
        boxShadow: selected
          ? `0 0 24px ${COLORS.task.primary}25`
          : '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'all 0.15s ease',
        '&:hover': {
          border: selected
            ? `2px solid ${COLORS.task.primary}`
            : `1px solid ${COLORS.task.border}80`,
          boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
        },
        position: 'relative',
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 0.6,
          bgcolor: COLORS.task.headerBg,
          borderBottom: `1px solid ${COLORS.task.border}30`,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
        }}
      >
        <AssignmentIcon sx={{ fontSize: 14, color: COLORS.task.primary }} />
        <Typography
          variant="caption"
          sx={{
            color: COLORS.task.primary,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontSize: '0.6rem',
          }}
        >
          Task
        </Typography>
      </Box>

      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: COLORS.text.primary,
            mb: 0.25,
            lineHeight: 1.3,
            fontSize: '0.8rem',
          }}
        >
          {data.name || 'Unnamed Task'}
        </Typography>
        {data.description && (
          <Typography
            variant="caption"
            sx={{
              color: COLORS.text.secondary,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
              fontSize: '0.65rem',
            }}
          >
            {data.description}
          </Typography>
        )}

        <Stack direction="row" spacing={0.5} sx={{ mt: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
          {data.output_file && (
            <Chip
              label={data.output_file}
              size="small"
              aria-label={`Output file: ${data.output_file}`}
              sx={{
                height: 18,
                fontSize: '0.55rem',
                bgcolor: `${COLORS.task.primary}18`,
                color: COLORS.task.primary,
                border: `1px solid ${COLORS.task.primary}35`,
                '& .MuiChip-label': { px: 0.6, py: 0 },
                maxWidth: 120,
              }}
            />
          )}
          {data.async_execution && (
            <Chip
              label="async"
              size="small"
              aria-label="Async execution enabled"
              sx={{
                height: 18,
                fontSize: '0.55rem',
                bgcolor: `${COLORS.surface.elevated}60`,
                color: COLORS.text.muted,
                border: `1px solid ${COLORS.surface.border}30`,
                '& .MuiChip-label': { px: 0.6, py: 0 },
              }}
            />
          )}
          {data.human_input && (
            <Chip
              label="human"
              size="small"
              aria-label="Human input required"
              sx={{
                height: 18,
                fontSize: '0.55rem',
                bgcolor: `${COLORS.agent.primary}18`,
                color: COLORS.agent.primary,
                border: `1px solid ${COLORS.agent.primary}35`,
                '& .MuiChip-label': { px: 0.6, py: 0 },
              }}
            />
          )}
        </Stack>
      </Box>

      {/* Execution input (left, upper) */}
      <Handle
        type="target"
        position={Position.Left}
        id="exec-in"
        style={{
          background: COLORS.text.secondary,
          borderRadius: '50%',
          width: 12,
          height: 12,
          border: `2px solid ${COLORS.surface.elevated}`,
          left: -6,
          top: '35%',
        }}
      />

      {/* Agent input (left, lower) */}
      <Handle
        type="target"
        position={Position.Left}
        id="agent"
        style={{
          background: COLORS.agent.primary,
          borderRadius: '50%',
          width: 12,
          height: 12,
          border: `2px solid ${COLORS.agent.dark}`,
          left: -6,
          top: '65%',
        }}
      />

      {/* Execution output (right) */}
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

export default memo(TaskNode);
