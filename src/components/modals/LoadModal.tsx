import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItemButton, ListItemText, Typography, IconButton,
  Tooltip, Box, Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { SavedGraph } from '../../types';
import { COLORS } from '../../theme';

interface LoadModalProps {
  open: boolean;
  onClose: () => void;
  savedGraphs: SavedGraph[];
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
}

export default function LoadModal({
  open,
  onClose,
  savedGraphs,
  onLoad,
  onDelete,
}: LoadModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleLoad = () => {
    if (selected) {
      onLoad(selected);
      onClose();
    }
  };

  const handleDelete = (name: string) => {
    if (confirmDelete === name) {
      onDelete(name);
      setConfirmDelete(null);
      if (selected === name) setSelected(null);
    } else {
      setConfirmDelete(name);
    }
  };

  const selectedGraph = savedGraphs.find(g => g.name === selected);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="load-dialog-title"
    >
      <DialogTitle
        id="load-dialog-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Open Crew</Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close open dialog">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {savedGraphs.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: COLORS.text.muted }}>
              No saved crews yet. Create a crew and save it first.
            </Typography>
          </Box>
        ) : (
          <List dense sx={{ maxHeight: 350, overflow: 'auto' }}>
            {savedGraphs.map((graph) => {
              const agentCount = graph.nodes.filter(n => n.type === 'agent').length;
              const taskCount = graph.nodes.filter(n => n.type === 'task').length;

              return (
                <ListItemButton
                  key={graph.name}
                  onClick={() => setSelected(graph.name)}
                  onDoubleClick={() => { onLoad(graph.name); onClose(); }}
                  selected={selected === graph.name}
                  aria-label={`Select ${graph.name}`}
                  sx={{
                    borderRadius: '8px',
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: `${COLORS.accent.blue}15`,
                      border: `1px solid ${COLORS.accent.blue}40`,
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          {graph.graphName || graph.name}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <Chip
                          label={`${agentCount} agent${agentCount !== 1 ? 's' : ''}`}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.6rem',
                            bgcolor: `${COLORS.agent.primary}15`,
                            color: COLORS.agent.primary,
                            '& .MuiChip-label': { px: 0.5 },
                          }}
                        />
                        <Chip
                          label={`${taskCount} task${taskCount !== 1 ? 's' : ''}`}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.6rem',
                            bgcolor: `${COLORS.task.primary}15`,
                            color: COLORS.task.primary,
                            '& .MuiChip-label': { px: 0.5 },
                          }}
                        />
                        {graph.savedAt && (
                          <Typography variant="caption" sx={{ color: COLORS.text.muted, fontSize: '0.6rem', ml: 0.5 }}>
                            {new Date(graph.savedAt).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <Tooltip title={confirmDelete === graph.name ? 'Click again to confirm' : 'Delete'}>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleDelete(graph.name); }}
                      aria-label={`Delete ${graph.name}`}
                      sx={{
                        color: confirmDelete === graph.name ? COLORS.accent.red : COLORS.text.muted,
                        '&:hover': { bgcolor: `${COLORS.accent.red}18` },
                      }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </ListItemButton>
              );
            })}
          </List>
        )}

        {selectedGraph && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              borderRadius: '8px',
              bgcolor: `${COLORS.surface.elevated}30`,
              border: `1px solid ${COLORS.surface.border}40`,
            }}
          >
            <Typography variant="caption" sx={{ color: COLORS.text.muted, fontSize: '0.65rem' }}>
              File: {selectedGraph.name} | Crew: {selectedGraph.graphName || 'Untitled'}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small" aria-label="Cancel">
          Cancel
        </Button>
        <Button
          onClick={handleLoad}
          variant="contained"
          size="small"
          disabled={!selected}
          startIcon={<FolderOpenIcon sx={{ fontSize: 16 }} />}
          aria-label="Open selected crew"
        >
          Open
        </Button>
      </DialogActions>
    </Dialog>
  );
}
