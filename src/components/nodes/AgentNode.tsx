import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Typography, Chip, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { AgentData } from '../../types';
import { COLORS } from '../../theme';

const AgentNode = ({ data, selected }: NodeProps<AgentData>) => {
  const toolCount = data.tools?.length || 0;
  const llmLabel = data.llm
    ? data.llm.split('/').pop()?.replace(/-\d{8}$/, '').split('-').slice(0, 3).join('-') || data.llm
    : null;

  return (
    <Box
      aria-label={`Agent node: ${data.name || 'Unnamed Agent'}`}
      sx={{
        minWidth: 220,
        maxWidth: 260,
        borderRadius: '12px',
        overflow: 'hidden',
        border: selected
          ? `2px solid ${COLORS.agent.primary}`
          : `1px solid ${COLORS.agent.border}40`,
        bgcolor: COLORS.agent.bg,
        boxShadow: selected
          ? `0 0 24px ${COLORS.agent.primary}25`
          : '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'all 0.15s ease',
        '&:hover': {
          border: selected
            ? `2px solid ${COLORS.agent.primary}`
            : `1px solid ${COLORS.agent.border}80`,
          boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
        },
        position: 'relative',
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 0.6,
          bgcolor: COLORS.agent.headerBg,
          borderBottom: `1px solid ${COLORS.agent.border}30`,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
        }}
      >
        <PersonIcon sx={{ fontSize: 14, color: COLORS.agent.primary }} />
        <Typography
          variant="caption"
          sx={{
            color: COLORS.agent.primary,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontSize: '0.6rem',
          }}
        >
          Agent
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
          {data.name || 'Unnamed Agent'}
        </Typography>
        {data.role && (
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
            {data.role}
          </Typography>
        )}

        <Stack direction="row" spacing={0.5} sx={{ mt: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
          {toolCount > 0 && (
            <Chip
              label={`${toolCount} tool${toolCount > 1 ? 's' : ''}`}
              size="small"
              aria-label={`${toolCount} tools assigned`}
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
          {llmLabel && (
            <Chip
              label={llmLabel}
              size="small"
              aria-label={`LLM: ${data.llm}`}
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
        </Stack>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        id="agent-out"
        style={{
          background: COLORS.agent.primary,
          borderRadius: '50%',
          width: 12,
          height: 12,
          border: `2px solid ${COLORS.agent.dark}`,
          right: -6,
        }}
      />
    </Box>
  );
};

export default memo(AgentNode);
