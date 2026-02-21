import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  List, ListItemButton, ListItemText, Typography, IconButton, Tooltip, Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import { SavedGraph } from '../../types';
import { COLORS } from '../../theme';

interface SaveModalProps {
  open: boolean;
  onClose: () => void;
  savedGraphs: SavedGraph[];
  currentName: string;
  onSave: (name: string) => void;
  onDelete: (name: string) => void;
}

export default function SaveModal({
  open,
  onClose,
  savedGraphs,
  currentName,
  onSave,
  onDelete,
}: SaveModalProps) {
  const [fileName, setFileName] = useState(currentName);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleSave = () => {
    if (!fileName.trim()) return;
    onSave(fileName.trim());
    onClose();
  };

  const handleDelete = (name: string) => {
    if (confirmDelete === name) {
      onDelete(name);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(name);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="save-dialog-title"
    >
      <DialogTitle
        id="save-dialog-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Save Crew</Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close save dialog">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          label="File Name"
          fullWidth
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
          autoFocus
          sx={{ mb: 2 }}
          inputProps={{ 'aria-label': 'Enter file name to save' }}
        />

        {savedGraphs.length > 0 && (
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: COLORS.text.muted,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                mb: 1,
                display: 'block',
              }}
            >
              Existing Saves
            </Typography>
            <List dense sx={{ maxHeight: 250, overflow: 'auto' }}>
              {savedGraphs.map((graph) => (
                <ListItemButton
                  key={graph.name}
                  onClick={() => setFileName(graph.name)}
                  selected={fileName === graph.name}
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
                    primary={graph.name}
                    secondary={graph.savedAt ? new Date(graph.savedAt).toLocaleDateString() : 'Unknown date'}
                    primaryTypographyProps={{ fontSize: '0.85rem' }}
                    secondaryTypographyProps={{ fontSize: '0.7rem' }}
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
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small" aria-label="Cancel">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="small"
          disabled={!fileName.trim()}
          startIcon={<SaveIcon sx={{ fontSize: 16 }} />}
          aria-label="Save crew"
        >
          {savedGraphs.some(g => g.name === fileName.trim()) ? 'Overwrite' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
