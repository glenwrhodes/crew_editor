import { useState } from 'react';
import {
  Box, Typography, Divider, IconButton, Tooltip, TextField,
  InputAdornment, Collapse,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { SavedAgent, SavedTask } from '../types';
import { COLORS } from '../theme';

interface SidebarProps {
  savedAgents: SavedAgent[];
  savedTasks: SavedTask[];
  onDeleteAgent: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

function DraggableNode({
  type,
  label,
  icon,
  color,
  savedData,
}: {
  type: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  savedData?: Record<string, unknown>;
}) {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
    if (savedData) {
      event.dataTransfer.setData('savedData', JSON.stringify(savedData));
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box
      aria-label={`Drag to add ${label}`}
      sx={{
        px: 1.25,
        py: 0.75,
        border: `1px solid ${color}30`,
        borderRadius: '8px',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: `${color}08`,
        transition: 'all 0.15s ease',
        '&:hover': {
          bgcolor: `${color}15`,
          border: `1px solid ${color}50`,
          transform: 'translateX(2px)',
        },
        '&:active': { cursor: 'grabbing' },
      }}
      draggable
      onDragStart={onDragStart}
    >
      {icon}
      <Typography
        noWrap
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '0.8rem',
          fontWeight: 500,
          color: COLORS.text.primary,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function SavedItemCard({
  name,
  icon,
  type,
  savedData,
  onDelete,
}: {
  name: string;
  icon: React.ReactNode;
  type: string;
  savedData: Record<string, unknown>;
  onDelete: () => void;
}) {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.setData('savedData', JSON.stringify(savedData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box
      aria-label={`Saved ${type}: ${name}. Drag to add.`}
      sx={{
        px: 1.25,
        py: 0.6,
        border: `1px solid ${COLORS.surface.border}40`,
        borderRadius: '8px',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: `${COLORS.surface.elevated}30`,
        transition: 'all 0.15s ease',
        '&:hover': {
          bgcolor: `${COLORS.surface.elevated}60`,
          border: `1px solid ${COLORS.surface.border}70`,
          '& .delete-btn': { opacity: 1 },
        },
        '&:active': { cursor: 'grabbing' },
      }}
      draggable
      onDragStart={onDragStart}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, flex: 1 }}>
        {icon}
        <Typography
          noWrap
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: COLORS.text.primary,
          }}
        >
          {name || 'Unnamed'}
        </Typography>
      </Box>
      <Tooltip title="Delete">
        <IconButton
          className="delete-btn"
          size="small"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          aria-label={`Delete ${name}`}
          sx={{
            opacity: 0,
            transition: 'opacity 0.15s',
            color: COLORS.accent.red,
            p: 0.25,
            '&:hover': { bgcolor: `${COLORS.accent.red}18` },
          }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function CollapsibleSection({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Box sx={{ mb: 0.5 }}>
      <Box
        onClick={() => setOpen(!open)}
        aria-label={`${open ? 'Collapse' : 'Expand'} ${title} section`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(!open); }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          py: 0.5,
          px: 0.5,
          borderRadius: '6px',
          '&:hover': { bgcolor: `${COLORS.surface.elevated}40` },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: COLORS.text.muted,
              fontSize: '0.6rem',
            }}
          >
            {title}
          </Typography>
          {count !== undefined && count > 0 && (
            <Box
              sx={{
                bgcolor: `${COLORS.surface.elevated}80`,
                borderRadius: '4px',
                px: 0.5,
                py: 0,
                minWidth: 16,
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ fontSize: '0.55rem', color: COLORS.text.muted }}>
                {count}
              </Typography>
            </Box>
          )}
        </Box>
        {open ? (
          <ExpandLessIcon sx={{ fontSize: 16, color: COLORS.text.muted }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 16, color: COLORS.text.muted }} />
        )}
      </Box>
      <Collapse in={open}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pt: 0.5 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

export default function Sidebar({
  savedAgents,
  savedTasks,
  onDeleteAgent,
  onDeleteTask,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAgents = savedAgents.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredTasks = savedTasks.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      aria-label="Sidebar - Node palette and saved items"
      sx={{
        width: 240,
        minWidth: 240,
        borderRight: `1px solid ${COLORS.surface.border}`,
        bgcolor: COLORS.surface.paper,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: COLORS.text.muted,
            fontSize: '0.6rem',
            mb: 1,
            display: 'block',
          }}
        >
          Node Palette
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <DraggableNode
            type="begin"
            label="Start"
            icon={<PlayArrowRoundedIcon sx={{ fontSize: 16, color: COLORS.begin.primary }} />}
            color={COLORS.begin.primary}
          />
          <DraggableNode
            type="agent"
            label="Agent"
            icon={<PersonIcon sx={{ fontSize: 16, color: COLORS.agent.primary }} />}
            color={COLORS.agent.primary}
          />
          <DraggableNode
            type="task"
            label="Task"
            icon={<AssignmentIcon sx={{ fontSize: 16, color: COLORS.task.primary }} />}
            color={COLORS.task.primary}
          />
        </Box>
      </Box>

      <Divider sx={{ mx: 1.5 }} />

      {/* Search */}
      {(savedAgents.length > 0 || savedTasks.length > 0) && (
        <Box sx={{ px: 1.5, pt: 1 }}>
          <TextField
            size="small"
            placeholder="Search saved..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            inputProps={{ 'aria-label': 'Search saved agents and tasks' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: COLORS.text.muted }} />
                </InputAdornment>
              ),
              sx: { fontSize: '0.75rem', height: 32 },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                bgcolor: `${COLORS.surface.elevated}30`,
              },
            }}
          />
        </Box>
      )}

      {/* Saved Items */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: 1.5,
          py: 1,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            background: COLORS.surface.elevated,
            borderRadius: 2,
          },
        }}
      >
        <CollapsibleSection title="Saved Agents" count={savedAgents.length}>
          {filteredAgents.length === 0 && savedAgents.length === 0 && (
            <Typography variant="caption" sx={{ color: COLORS.text.muted, fontStyle: 'italic', fontSize: '0.65rem', px: 0.5 }}>
              Save agents from the properties panel
            </Typography>
          )}
          {filteredAgents.length === 0 && savedAgents.length > 0 && (
            <Typography variant="caption" sx={{ color: COLORS.text.muted, fontStyle: 'italic', fontSize: '0.65rem', px: 0.5 }}>
              No agents match your search
            </Typography>
          )}
          {filteredAgents.map(agent => (
            <SavedItemCard
              key={agent.id}
              name={agent.name}
              icon={<PersonIcon sx={{ fontSize: 14, color: COLORS.agent.primary }} />}
              type="agent"
              savedData={agent as unknown as Record<string, unknown>}
              onDelete={() => onDeleteAgent(agent.id)}
            />
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Saved Tasks" count={savedTasks.length}>
          {filteredTasks.length === 0 && savedTasks.length === 0 && (
            <Typography variant="caption" sx={{ color: COLORS.text.muted, fontStyle: 'italic', fontSize: '0.65rem', px: 0.5 }}>
              Save tasks from the properties panel
            </Typography>
          )}
          {filteredTasks.length === 0 && savedTasks.length > 0 && (
            <Typography variant="caption" sx={{ color: COLORS.text.muted, fontStyle: 'italic', fontSize: '0.65rem', px: 0.5 }}>
              No tasks match your search
            </Typography>
          )}
          {filteredTasks.map(task => (
            <SavedItemCard
              key={task.id}
              name={task.name}
              icon={<AssignmentIcon sx={{ fontSize: 14, color: COLORS.task.primary }} />}
              type="task"
              savedData={task as unknown as Record<string, unknown>}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </CollapsibleSection>
      </Box>

      {/* Footer hint */}
      <Box sx={{ px: 1.5, py: 1, borderTop: `1px solid ${COLORS.surface.border}50` }}>
        <Typography variant="caption" sx={{ color: COLORS.text.muted, fontSize: '0.6rem', lineHeight: 1.4 }}>
          Drag nodes onto the canvas. Connect agents to tasks, and chain tasks together.
        </Typography>
      </Box>
    </Box>
  );
}
