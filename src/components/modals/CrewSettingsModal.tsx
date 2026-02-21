import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, FormControlLabel, Checkbox, Select, MenuItem,
  InputLabel, FormControl, Typography, IconButton, Box, Stack,
  Divider, Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CrewSettings, AVAILABLE_LLMS } from '../../types';
import { COLORS } from '../../theme';

interface CrewSettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: CrewSettings;
  onUpdate: (settings: CrewSettings) => void;
}

export default function CrewSettingsModal({
  open,
  onClose,
  settings,
  onUpdate,
}: CrewSettingsModalProps) {
  const handleChange = (field: keyof CrewSettings, value: unknown) => {
    onUpdate({ ...settings, [field]: value });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="crew-settings-title"
    >
      <DialogTitle
        id="crew-settings-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Crew Settings</Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close crew settings">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Crew Name"
            fullWidth
            value={settings.name}
            onChange={(e) => handleChange('name', e.target.value)}
            inputProps={{ 'aria-label': 'Crew name' }}
          />

          <FormControl fullWidth size="small">
            <InputLabel id="process-label">Process Type</InputLabel>
            <Select
              labelId="process-label"
              value={settings.process}
              label="Process Type"
              onChange={(e) => handleChange('process', e.target.value)}
              aria-label="Select process type"
            >
              <MenuItem value="sequential">
                <Box>
                  <Typography variant="body2">Sequential</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.text.muted }}>
                    Tasks execute one after another
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="hierarchical">
                <Box>
                  <Typography variant="body2">Hierarchical</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.text.muted }}>
                    Manager agent delegates to other agents
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <Collapse in={settings.process === 'hierarchical'}>
            <FormControl fullWidth size="small">
              <InputLabel id="manager-llm-label">Manager LLM</InputLabel>
              <Select
                labelId="manager-llm-label"
                value={settings.managerLlm}
                label="Manager LLM"
                onChange={(e) => handleChange('managerLlm', e.target.value)}
                aria-label="Select manager LLM"
              >
                <MenuItem value="">
                  <em>Default</em>
                </MenuItem>
                {AVAILABLE_LLMS.map(m => (
                  <MenuItem key={m.value} value={m.value} sx={{ fontSize: '0.85rem' }}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Collapse>

          <Divider />

          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: COLORS.text.muted,
              fontSize: '0.65rem',
            }}
          >
            Features
          </Typography>

          <Stack spacing={0.5}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.memory}
                  onChange={(e) => handleChange('memory', e.target.checked)}
                  size="small"
                  inputProps={{ 'aria-label': 'Enable crew memory' }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Memory</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.text.muted }}>
                    Enable long-term and short-term memory for agents
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.cache}
                  onChange={(e) => handleChange('cache', e.target.checked)}
                  size="small"
                  inputProps={{ 'aria-label': 'Enable cache' }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Cache</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.text.muted }}>
                    Cache tool results to avoid redundant calls
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.verbose}
                  onChange={(e) => handleChange('verbose', e.target.checked)}
                  size="small"
                  inputProps={{ 'aria-label': 'Verbose output' }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Verbose</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.text.muted }}>
                    Show detailed logs during execution
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.fullOutput}
                  onChange={(e) => handleChange('fullOutput', e.target.checked)}
                  size="small"
                  inputProps={{ 'aria-label': 'Full output' }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Full Output</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.text.muted }}>
                    Return output from all tasks, not just the final one
                  </Typography>
                </Box>
              }
            />
          </Stack>

          <Divider />

          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: COLORS.text.muted,
              fontSize: '0.65rem',
            }}
          >
            Planning
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={settings.planning}
                onChange={(e) => handleChange('planning', e.target.checked)}
                size="small"
                inputProps={{ 'aria-label': 'Enable planning' }}
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Enable Planning</Typography>
                <Typography variant="caption" sx={{ color: COLORS.text.muted }}>
                  Create an execution plan before running tasks
                </Typography>
              </Box>
            }
          />

          <Collapse in={settings.planning}>
            <FormControl fullWidth size="small">
              <InputLabel id="planner-llm-label">Planner LLM</InputLabel>
              <Select
                labelId="planner-llm-label"
                value={settings.plannerLlm}
                label="Planner LLM"
                onChange={(e) => handleChange('plannerLlm', e.target.value)}
                aria-label="Select planner LLM"
              >
                <MenuItem value="">
                  <em>Default</em>
                </MenuItem>
                {AVAILABLE_LLMS.map(m => (
                  <MenuItem key={m.value} value={m.value} sx={{ fontSize: '0.85rem' }}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Collapse>

          <Divider />

          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: COLORS.text.muted,
              fontSize: '0.65rem',
            }}
          >
            Advanced
          </Typography>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Max RPM"
              type="number"
              value={settings.maxRpm}
              onChange={(e) => handleChange('maxRpm', parseInt(e.target.value) || 0)}
              sx={{ flex: 1 }}
              inputProps={{ min: 0, 'aria-label': 'Maximum requests per minute' }}
              helperText="0 = no limit"
            />
            <TextField
              label="Language"
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              sx={{ flex: 1 }}
              inputProps={{ 'aria-label': 'Output language' }}
              helperText="e.g. en, es, fr"
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" size="small" aria-label="Done">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
