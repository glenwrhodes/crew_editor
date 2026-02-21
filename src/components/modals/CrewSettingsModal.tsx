import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, FormControlLabel, Checkbox, Select, MenuItem,
  InputLabel, FormControl, Typography, IconButton, Box, Stack,
  Divider, Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InputIcon from '@mui/icons-material/Input';
import { CrewSettings, CrewInput, AVAILABLE_LLMS } from '../../types';
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

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <InputIcon sx={{ fontSize: 14, color: COLORS.text.muted }} />
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
                Crew Inputs
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              onClick={() => {
                const inputs = [...(settings.inputs || []), { name: '', description: '', defaultValue: '' }];
                handleChange('inputs', inputs);
              }}
              aria-label="Add crew input variable"
              sx={{ fontSize: '0.7rem', textTransform: 'none' }}
            >
              Add Input
            </Button>
          </Box>

          <Typography variant="caption" sx={{ color: COLORS.text.muted, mt: -1 }}>
            Define variables like <code style={{ color: COLORS.task.primary }}>{'{topic}'}</code> or <code style={{ color: COLORS.task.primary }}>{'{company}'}</code> that get passed in at runtime via <code>crew.kickoff(inputs={'{...}'})</code>
          </Typography>

          {(settings.inputs || []).map((input: CrewInput, idx: number) => (
            <Box
              key={idx}
              sx={{
                p: 1.5,
                borderRadius: '10px',
                border: `1px solid ${COLORS.surface.border}50`,
                bgcolor: `${COLORS.surface.elevated}20`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: COLORS.text.muted, fontWeight: 600, fontSize: '0.65rem' }}>
                  Input #{idx + 1}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    const inputs = settings.inputs.filter((_: CrewInput, i: number) => i !== idx);
                    handleChange('inputs', inputs);
                  }}
                  aria-label={`Remove input ${input.name || idx + 1}`}
                  sx={{ color: COLORS.accent.red, p: 0.25 }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
              <Stack spacing={1.5}>
                <TextField
                  label="Variable Name"
                  size="small"
                  fullWidth
                  value={input.name}
                  onChange={(e) => {
                    const sanitized = e.target.value.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
                    const inputs = settings.inputs.map((inp: CrewInput, i: number) =>
                      i === idx ? { ...inp, name: sanitized } : inp
                    );
                    handleChange('inputs', inputs);
                  }}
                  placeholder="e.g. topic"
                  helperText={input.name ? `Use as {${input.name}} in agent/task fields` : 'Letters, numbers, underscores only'}
                  inputProps={{ 'aria-label': `Input variable name ${idx + 1}` }}
                  FormHelperTextProps={{ sx: { color: input.name ? COLORS.task.primary : COLORS.text.muted, fontSize: '0.65rem' } }}
                />
                <TextField
                  label="Description"
                  size="small"
                  fullWidth
                  value={input.description}
                  onChange={(e) => {
                    const inputs = settings.inputs.map((inp: CrewInput, i: number) =>
                      i === idx ? { ...inp, description: e.target.value } : inp
                    );
                    handleChange('inputs', inputs);
                  }}
                  placeholder="What this input is for"
                  inputProps={{ 'aria-label': `Input description ${idx + 1}` }}
                />
                <TextField
                  label="Default Value (optional)"
                  size="small"
                  fullWidth
                  value={input.defaultValue}
                  onChange={(e) => {
                    const inputs = settings.inputs.map((inp: CrewInput, i: number) =>
                      i === idx ? { ...inp, defaultValue: e.target.value } : inp
                    );
                    handleChange('inputs', inputs);
                  }}
                  placeholder="e.g. Artificial Intelligence"
                  inputProps={{ 'aria-label': `Input default value ${idx + 1}` }}
                />
              </Stack>
            </Box>
          ))}

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
