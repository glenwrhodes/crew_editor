import {
  Box, Typography, IconButton, Tooltip, Button, Divider, TextField,
  Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import { useState } from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SettingsIcon from '@mui/icons-material/Settings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { COLORS } from '../theme';

interface ToolbarProps {
  graphTitle: string;
  onTitleChange: (title: string) => void;
  onNew: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExportYaml: () => void;
  onExportPython: () => void;
  onCrewSettings: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSaveSelectedNode: () => void;
  hasSelectedNode: boolean;
  onDuplicate: () => void;
  onTemplates: () => void;
}

export default function Toolbar({
  graphTitle,
  onTitleChange,
  onNew,
  onSave,
  onLoad,
  onExportYaml,
  onExportPython,
  onCrewSettings,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSaveSelectedNode,
  hasSelectedNode,
  onDuplicate,
  onTemplates,
}: ToolbarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);

  return (
    <Box
      aria-label="Toolbar"
      sx={{
        height: 48,
        minHeight: 48,
        display: 'flex',
        alignItems: 'center',
        px: 1.5,
        gap: 0.5,
        borderBottom: `1px solid ${COLORS.surface.border}`,
        bgcolor: COLORS.surface.paper,
        flexShrink: 0,
      }}
    >
      {/* App branding + title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '8px',
            bgcolor: `${COLORS.accent.blue}20`,
            border: `1px solid ${COLORS.accent.blue}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: COLORS.accent.blue }}>
            C
          </Typography>
        </Box>

        {isEditingTitle ? (
          <TextField
            value={graphTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingTitle(false); }}
            autoFocus
            size="small"
            inputProps={{
              'aria-label': 'Graph title',
              style: { fontSize: '0.85rem', fontWeight: 600, padding: '2px 8px' },
            }}
            sx={{
              width: 200,
              '& .MuiOutlinedInput-root': { borderRadius: '6px' },
            }}
          />
        ) : (
          <Tooltip title="Click to rename">
            <Typography
              onClick={() => setIsEditingTitle(true)}
              sx={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: COLORS.text.primary,
                cursor: 'pointer',
                px: 1,
                py: 0.25,
                borderRadius: '6px',
                '&:hover': { bgcolor: `${COLORS.surface.elevated}60` },
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              aria-label="Graph title - click to edit"
            >
              {graphTitle || 'Untitled'}
            </Typography>
          </Tooltip>
        )}
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Undo / Redo */}
      <Tooltip title="Undo (Ctrl+Z)">
        <span>
          <IconButton
            size="small"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo"
            sx={{ color: COLORS.text.secondary }}
          >
            <UndoIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Redo (Ctrl+Y)">
        <span>
          <IconButton
            size="small"
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo"
            sx={{ color: COLORS.text.secondary }}
          >
            <RedoIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </span>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Node actions */}
      <Tooltip title="Save selected node as template">
        <span>
          <IconButton
            size="small"
            onClick={onSaveSelectedNode}
            disabled={!hasSelectedNode}
            aria-label="Save selected node as template"
            sx={{ color: COLORS.text.secondary }}
          >
            <BookmarkAddIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Duplicate selected node (Ctrl+D)">
        <span>
          <IconButton
            size="small"
            onClick={onDuplicate}
            disabled={!hasSelectedNode}
            aria-label="Duplicate selected node"
            sx={{ color: COLORS.text.secondary }}
          >
            <ContentCopyIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </span>
      </Tooltip>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Crew Settings */}
      <Tooltip title="Crew Settings">
        <IconButton
          size="small"
          onClick={onCrewSettings}
          aria-label="Crew settings"
          sx={{ color: COLORS.text.secondary }}
        >
          <SettingsIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Export */}
      <Tooltip title="Export crew">
        <Button
          size="small"
          startIcon={<FileDownloadIcon sx={{ fontSize: 16 }} />}
          onClick={(e) => setExportAnchor(e.currentTarget)}
          aria-label="Export crew"
          aria-haspopup="true"
          sx={{
            color: COLORS.text.secondary,
            fontSize: '0.75rem',
            px: 1,
            minWidth: 0,
            '&:hover': { bgcolor: `${COLORS.surface.elevated}60` },
          }}
        >
          Export
        </Button>
      </Tooltip>

      <Menu
        anchorEl={exportAnchor}
        open={Boolean(exportAnchor)}
        onClose={() => setExportAnchor(null)}
        aria-label="Export options"
      >
        <MenuItem
          onClick={() => { onExportYaml(); setExportAnchor(null); }}
          aria-label="Export as YAML"
        >
          <ListItemIcon><DataObjectIcon sx={{ fontSize: 18 }} /></ListItemIcon>
          <ListItemText>
            <Typography variant="body2">YAML Config</Typography>
            <Typography variant="caption" sx={{ color: COLORS.text.muted }}>agents.yaml + tasks.yaml</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => { onExportPython(); setExportAnchor(null); }}
          aria-label="Export as Python"
        >
          <ListItemIcon><CodeIcon sx={{ fontSize: 18 }} /></ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Python Code</Typography>
            <Typography variant="caption" sx={{ color: COLORS.text.muted }}>crew.py</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* File ops */}
      <Tooltip title="Templates">
        <IconButton
          size="small"
          onClick={onTemplates}
          aria-label="Browse crew templates"
          sx={{ color: COLORS.text.secondary }}
        >
          <DashboardIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="New crew">
        <IconButton
          size="small"
          onClick={onNew}
          aria-label="New crew"
          sx={{ color: COLORS.text.secondary }}
        >
          <AddIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Save (Ctrl+S)">
        <IconButton
          size="small"
          onClick={onSave}
          aria-label="Save crew"
          sx={{ color: COLORS.text.secondary }}
        >
          <SaveIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Open">
        <IconButton
          size="small"
          onClick={onLoad}
          aria-label="Open saved crew"
          sx={{ color: COLORS.text.secondary }}
        >
          <FolderOpenIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
