import { useMemo } from 'react';
import {
  Box, Typography, TextField, Divider, Autocomplete, Chip,
  FormControlLabel, Checkbox, Select, MenuItem, InputLabel,
  FormControl, IconButton, Tooltip, Stack, Collapse,
} from '@mui/material';
import { Node, Edge } from 'reactflow';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BuildIcon from '@mui/icons-material/Build';
import TuneIcon from '@mui/icons-material/Tune';
import LinkIcon from '@mui/icons-material/Link';
import {
  AgentData, TaskData, AVAILABLE_TOOLS, AVAILABLE_LLMS, ToolInfo,
} from '../types';
import { COLORS } from '../theme';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  nodes: Node[];
  edges: Edge[];
  onUpdateNodeData: (nodeId: string, data: Partial<AgentData | TaskData>) => void;
  onClose: () => void;
}

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2.5, mb: 1.5 }}>
      {icon}
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: COLORS.text.muted,
          fontSize: '0.65rem',
        }}
      >
        {label}
      </Typography>
      <Divider sx={{ flex: 1, ml: 1 }} />
    </Box>
  );
}

function AgentProperties({
  data,
  onUpdate,
  connectedTasks,
}: {
  data: AgentData;
  onUpdate: (field: string, value: unknown) => void;
  connectedTasks: string[];
}) {
  const groupedTools = useMemo(() => {
    const groups: Record<string, ToolInfo[]> = {};
    AVAILABLE_TOOLS.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, []);

  const groupedLlms = useMemo(() => {
    const groups: Record<string, typeof AVAILABLE_LLMS> = {};
    AVAILABLE_LLMS.forEach(l => {
      if (!groups[l.provider]) groups[l.provider] = [];
      groups[l.provider].push(l);
    });
    return groups;
  }, []);

  return (
    <Box>
      <TextField
        label="Name"
        fullWidth
        value={data.name || ''}
        onChange={(e) => onUpdate('name', e.target.value)}
        sx={{ mb: 1.5 }}
        inputProps={{ 'aria-label': 'Agent name' }}
      />
      <TextField
        label="Role"
        fullWidth
        multiline
        minRows={2}
        maxRows={4}
        value={data.role || ''}
        onChange={(e) => onUpdate('role', e.target.value)}
        sx={{ mb: 1.5 }}
        inputProps={{ 'aria-label': 'Agent role' }}
      />
      <TextField
        label="Goal"
        fullWidth
        multiline
        minRows={2}
        maxRows={4}
        value={data.goal || ''}
        onChange={(e) => onUpdate('goal', e.target.value)}
        sx={{ mb: 1.5 }}
        inputProps={{ 'aria-label': 'Agent goal' }}
      />
      <TextField
        label="Backstory"
        fullWidth
        multiline
        minRows={3}
        maxRows={6}
        value={data.backstory || ''}
        onChange={(e) => onUpdate('backstory', e.target.value)}
        inputProps={{ 'aria-label': 'Agent backstory' }}
      />

      <SectionHeader
        icon={<TuneIcon sx={{ fontSize: 14, color: COLORS.text.muted }} />}
        label="LLM Configuration"
      />

      <FormControl fullWidth size="small">
        <InputLabel id="llm-select-label">Model</InputLabel>
        <Select
          labelId="llm-select-label"
          value={data.llm || ''}
          label="Model"
          onChange={(e) => onUpdate('llm', e.target.value)}
          aria-label="Select LLM model"
          MenuProps={{ PaperProps: { sx: { maxHeight: 400 } } }}
        >
          {Object.entries(groupedLlms).map(([provider, models]) => [
            <MenuItem key={`header-${provider}`} disabled sx={{ opacity: 0.6, fontWeight: 700, fontSize: '0.75rem' }}>
              {provider}
            </MenuItem>,
            ...models.map(m => (
              <MenuItem key={m.value} value={m.value} sx={{ pl: 3, fontSize: '0.85rem' }}>
                {m.label}
              </MenuItem>
            )),
          ])}
        </Select>
      </FormControl>

      <SectionHeader
        icon={<BuildIcon sx={{ fontSize: 14, color: COLORS.text.muted }} />}
        label="Tools"
      />

      <Autocomplete
        multiple
        options={AVAILABLE_TOOLS}
        getOptionLabel={(option) => option.name}
        groupBy={(option) => option.category}
        value={AVAILABLE_TOOLS.filter(t => data.tools?.includes(t.name))}
        onChange={(_e, newValue) => onUpdate('tools', newValue.map(v => v.name))}
        renderInput={(params) => (
          <TextField {...params} label="Select tools" placeholder="Search tools..." inputProps={{ ...params.inputProps, 'aria-label': 'Select tools' }} />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...rest } = getTagProps({ index });
            return (
              <Chip
                key={key}
                label={option.name}
                size="small"
                {...rest}
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  bgcolor: `${COLORS.agent.primary}18`,
                  color: COLORS.agent.primary,
                  border: `1px solid ${COLORS.agent.primary}35`,
                  '& .MuiChip-deleteIcon': { fontSize: 14, color: `${COLORS.agent.primary}80` },
                }}
              />
            );
          })
        }
        renderOption={(props, option) => {
          const { key, ...rest } = props as { key: string } & React.HTMLAttributes<HTMLLIElement>;
          return (
            <li key={key} {...rest}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.8rem' }}>
                  {option.name}
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.text.muted, fontSize: '0.65rem' }}>
                  {option.description}
                </Typography>
              </Box>
            </li>
          );
        }}
        sx={{ mb: 1 }}
        aria-label="Tools selection"
      />

      {Object.keys(groupedTools).length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {AVAILABLE_TOOLS
            .filter(t => !data.tools?.includes(t.name))
            .slice(0, 8)
            .map(t => (
              <Chip
                key={t.name}
                label={t.name.replace(/Tool$/, '')}
                size="small"
                onClick={() => onUpdate('tools', [...(data.tools || []), t.name])}
                aria-label={`Quick add ${t.name}`}
                sx={{
                  height: 20,
                  fontSize: '0.6rem',
                  bgcolor: `${COLORS.surface.elevated}40`,
                  color: COLORS.text.muted,
                  border: `1px solid ${COLORS.surface.border}30`,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: `${COLORS.surface.elevated}80`, color: COLORS.text.secondary },
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            ))}
        </Box>
      )}

      <SectionHeader
        icon={<TuneIcon sx={{ fontSize: 14, color: COLORS.text.muted }} />}
        label="Advanced"
      />

      <Stack spacing={0.5}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={data.allowDelegation || false}
              onChange={(e) => onUpdate('allowDelegation', e.target.checked)}
              inputProps={{ 'aria-label': 'Allow delegation' }}
            />
          }
          label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Allow Delegation</Typography>}
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={data.verbose !== false}
              onChange={(e) => onUpdate('verbose', e.target.checked)}
              inputProps={{ 'aria-label': 'Verbose output' }}
            />
          }
          label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Verbose</Typography>}
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={data.memory !== false}
              onChange={(e) => onUpdate('memory', e.target.checked)}
              inputProps={{ 'aria-label': 'Enable memory' }}
            />
          }
          label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Memory</Typography>}
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={data.cacheEnabled !== false}
              onChange={(e) => onUpdate('cacheEnabled', e.target.checked)}
              inputProps={{ 'aria-label': 'Enable cache' }}
            />
          }
          label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Cache</Typography>}
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={data.allowCodeExecution || false}
              onChange={(e) => onUpdate('allowCodeExecution', e.target.checked)}
              inputProps={{ 'aria-label': 'Allow code execution' }}
            />
          }
          label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Allow Code Execution</Typography>}
        />
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
        <TextField
          label="Max Iterations"
          type="number"
          value={data.maxIter ?? 25}
          onChange={(e) => onUpdate('maxIter', parseInt(e.target.value) || 25)}
          sx={{ flex: 1 }}
          inputProps={{ min: 1, 'aria-label': 'Maximum iterations' }}
        />
        <TextField
          label="Max RPM"
          type="number"
          value={data.maxRpm ?? 0}
          onChange={(e) => onUpdate('maxRpm', parseInt(e.target.value) || 0)}
          sx={{ flex: 1 }}
          inputProps={{ min: 0, 'aria-label': 'Maximum requests per minute' }}
        />
      </Stack>

      <TextField
        label="Max Retry Limit"
        type="number"
        value={data.maxRetryLimit ?? 2}
        onChange={(e) => onUpdate('maxRetryLimit', parseInt(e.target.value) || 2)}
        fullWidth
        sx={{ mt: 1.5 }}
        inputProps={{ min: 0, 'aria-label': 'Maximum retry limit' }}
      />

      <Collapse in={connectedTasks.length > 0}>
        <SectionHeader
          icon={<LinkIcon sx={{ fontSize: 14, color: COLORS.text.muted }} />}
          label="Connected Tasks"
        />
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {connectedTasks.map(name => (
            <Chip
              key={name}
              label={name}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.7rem',
                bgcolor: `${COLORS.task.primary}18`,
                color: COLORS.task.primary,
                border: `1px solid ${COLORS.task.primary}35`,
              }}
            />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}

function TaskProperties({
  data,
  onUpdate,
  connectedAgentName,
  contextTaskNames,
}: {
  data: TaskData;
  onUpdate: (field: string, value: unknown) => void;
  connectedAgentName: string | null;
  contextTaskNames: string[];
}) {
  return (
    <Box>
      <TextField
        label="Name"
        fullWidth
        value={data.name || ''}
        onChange={(e) => onUpdate('name', e.target.value)}
        sx={{ mb: 1.5 }}
        inputProps={{ 'aria-label': 'Task name' }}
      />
      <TextField
        label="Description"
        fullWidth
        multiline
        minRows={3}
        maxRows={8}
        value={data.description || ''}
        onChange={(e) => onUpdate('description', e.target.value)}
        sx={{ mb: 1.5 }}
        inputProps={{ 'aria-label': 'Task description' }}
      />
      <TextField
        label="Expected Output"
        fullWidth
        multiline
        minRows={3}
        maxRows={8}
        value={data.expected_output || ''}
        onChange={(e) => onUpdate('expected_output', e.target.value)}
        inputProps={{ 'aria-label': 'Expected output' }}
      />

      <SectionHeader
        icon={<TuneIcon sx={{ fontSize: 14, color: COLORS.text.muted }} />}
        label="Output"
      />

      <TextField
        label="Output File (optional)"
        fullWidth
        value={data.output_file || ''}
        onChange={(e) => onUpdate('output_file', e.target.value)}
        placeholder="e.g. report.md"
        inputProps={{ 'aria-label': 'Output file path' }}
      />

      <SectionHeader
        icon={<TuneIcon sx={{ fontSize: 14, color: COLORS.text.muted }} />}
        label="Advanced"
      />

      <Stack spacing={0.5}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={data.async_execution || false}
              onChange={(e) => onUpdate('async_execution', e.target.checked)}
              inputProps={{ 'aria-label': 'Async execution' }}
            />
          }
          label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Async Execution</Typography>}
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={data.human_input || false}
              onChange={(e) => onUpdate('human_input', e.target.checked)}
              inputProps={{ 'aria-label': 'Human input required' }}
            />
          }
          label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Human Input Required</Typography>}
        />
      </Stack>

      <SectionHeader
        icon={<LinkIcon sx={{ fontSize: 14, color: COLORS.text.muted }} />}
        label="Connections"
      />

      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ color: COLORS.text.muted, fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
          Assigned Agent
        </Typography>
        {connectedAgentName ? (
          <Chip
            icon={<PersonIcon sx={{ fontSize: 14 }} />}
            label={connectedAgentName}
            size="small"
            sx={{
              height: 24,
              fontSize: '0.75rem',
              bgcolor: `${COLORS.agent.primary}18`,
              color: COLORS.agent.primary,
              border: `1px solid ${COLORS.agent.primary}35`,
              '& .MuiChip-icon': { color: COLORS.agent.primary },
            }}
          />
        ) : (
          <Typography variant="caption" sx={{ color: COLORS.text.muted, fontStyle: 'italic', fontSize: '0.7rem' }}>
            Connect an Agent node to assign
          </Typography>
        )}
      </Box>

      <Collapse in={contextTaskNames.length > 0}>
        <Box>
          <Typography variant="caption" sx={{ color: COLORS.text.muted, fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
            Context From
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            {contextTaskNames.map(name => (
              <Chip
                key={name}
                icon={<AssignmentIcon sx={{ fontSize: 14 }} />}
                label={name}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  bgcolor: `${COLORS.task.primary}18`,
                  color: COLORS.task.primary,
                  border: `1px solid ${COLORS.task.primary}35`,
                  '& .MuiChip-icon': { color: COLORS.task.primary },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}

export default function PropertiesPanel({
  selectedNode,
  nodes,
  edges,
  onUpdateNodeData,
  onClose,
}: PropertiesPanelProps) {
  const nodeType = selectedNode?.type;
  const nodeData = selectedNode?.data;

  const connectionInfo = useMemo(() => {
    if (!selectedNode) return { connectedAgentName: null, connectedTasks: [] as string[], contextTaskNames: [] as string[] };

    if (nodeType === 'task') {
      const agentEdge = edges.find(
        e => e.target === selectedNode.id && nodes.find(n => n.id === e.source)?.type === 'agent'
      );
      const connectedAgentName = agentEdge
        ? (nodes.find(n => n.id === agentEdge.source)?.data as AgentData)?.name || 'Unnamed'
        : null;

      const contextEdges = edges.filter(
        e => e.target === selectedNode.id && e.targetHandle === 'exec-in' && nodes.find(n => n.id === e.source)?.type === 'task'
      );
      const contextTaskNames = contextEdges
        .map(e => (nodes.find(n => n.id === e.source)?.data as TaskData)?.name || 'Unnamed')
        .filter(Boolean);

      return { connectedAgentName, connectedTasks: [], contextTaskNames };
    }

    if (nodeType === 'agent') {
      const taskEdges = edges.filter(
        e => e.source === selectedNode.id && nodes.find(n => n.id === e.target)?.type === 'task'
      );
      const connectedTasks = taskEdges
        .map(e => (nodes.find(n => n.id === e.target)?.data as TaskData)?.name || 'Unnamed')
        .filter(Boolean);

      return { connectedAgentName: null, connectedTasks, contextTaskNames: [] };
    }

    return { connectedAgentName: null, connectedTasks: [], contextTaskNames: [] };
  }, [selectedNode, nodes, edges, nodeType]);

  if (!selectedNode || (nodeType !== 'agent' && nodeType !== 'task')) return null;

  const headerColor = nodeType === 'agent' ? COLORS.agent.primary : COLORS.task.primary;
  const headerBg = nodeType === 'agent' ? COLORS.agent.headerBg : COLORS.task.headerBg;
  const headerIcon = nodeType === 'agent'
    ? <PersonIcon sx={{ fontSize: 18, color: headerColor }} />
    : <AssignmentIcon sx={{ fontSize: 18, color: headerColor }} />;
  const headerLabel = nodeType === 'agent' ? 'Agent Properties' : 'Task Properties';

  const handleUpdate = (field: string, value: unknown) => {
    onUpdateNodeData(selectedNode.id, { [field]: value });
  };

  return (
    <Box
      aria-label="Properties panel"
      sx={{
        width: 340,
        minWidth: 340,
        maxWidth: 340,
        borderLeft: `1px solid ${COLORS.surface.border}`,
        bgcolor: COLORS.surface.paper,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: headerBg,
          borderBottom: `1px solid ${COLORS.surface.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {headerIcon}
          <Typography variant="subtitle2" sx={{ color: headerColor, fontWeight: 700, fontSize: '0.85rem' }}>
            {headerLabel}
          </Typography>
        </Box>
        <Tooltip title="Close panel">
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close properties panel"
            sx={{ color: COLORS.text.muted }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: 2,
          py: 2,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            background: COLORS.surface.elevated,
            borderRadius: 2,
          },
        }}
      >
        {nodeType === 'agent' && (
          <AgentProperties
            data={nodeData as AgentData}
            onUpdate={handleUpdate}
            connectedTasks={connectionInfo.connectedTasks}
          />
        )}
        {nodeType === 'task' && (
          <TaskProperties
            data={nodeData as TaskData}
            onUpdate={handleUpdate}
            connectedAgentName={connectionInfo.connectedAgentName}
            contextTaskNames={connectionInfo.contextTaskNames}
          />
        )}
      </Box>
    </Box>
  );
}
