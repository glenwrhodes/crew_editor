import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { COLORS } from '../../theme';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const color = variant === 'danger'
    ? COLORS.accent.red
    : variant === 'warning'
      ? COLORS.agent.primary
      : COLORS.accent.blue;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}
      >
        <WarningAmberIcon sx={{ color, fontSize: 24 }} />
        <Typography variant="h6" sx={{ fontSize: '1rem' }}>{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          size="small"
          aria-label={cancelLabel}
          sx={{ color: COLORS.text.secondary, borderColor: COLORS.surface.border }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          size="small"
          aria-label={confirmLabel}
          sx={{
            bgcolor: color,
            '&:hover': { bgcolor: color, filter: 'brightness(0.9)' },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
