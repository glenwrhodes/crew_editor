import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box,
  Typography, Tabs, Tab, IconButton, Tooltip, Snackbar, Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { COLORS } from '../../theme';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  agentsYaml: string;
  tasksYaml: string;
  pythonCode: string;
  mode: 'yaml' | 'python';
}

function CodeBlock({ content, filename }: { content: string; filename: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 1.5,
          py: 0.5,
          bgcolor: `${COLORS.surface.elevated}80`,
          borderRadius: '8px 8px 0 0',
          border: `1px solid ${COLORS.surface.border}`,
          borderBottom: 'none',
        }}
      >
        <Typography variant="caption" sx={{ color: COLORS.text.muted, fontFamily: 'monospace', fontSize: '0.7rem' }}>
          {filename}
        </Typography>
        <Box>
          <Tooltip title="Copy to clipboard">
            <IconButton size="small" onClick={handleCopy} aria-label={`Copy ${filename} to clipboard`}>
              <ContentCopyIcon sx={{ fontSize: 14, color: COLORS.text.muted }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download file">
            <IconButton size="small" onClick={handleDownload} aria-label={`Download ${filename}`}>
              <DownloadIcon sx={{ fontSize: 14, color: COLORS.text.muted }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          bgcolor: COLORS.surface.bg,
          border: `1px solid ${COLORS.surface.border}`,
          borderRadius: '0 0 8px 8px',
          overflow: 'auto',
          maxHeight: 400,
          fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
          fontSize: '0.75rem',
          lineHeight: 1.6,
          color: COLORS.text.primary,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          '&::-webkit-scrollbar': { width: 4, height: 4 },
          '&::-webkit-scrollbar-thumb': {
            background: COLORS.surface.elevated,
            borderRadius: 2,
          },
        }}
      >
        {content}
      </Box>
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ fontSize: '0.8rem' }}>
          Copied to clipboard
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function ExportModal({
  open,
  onClose,
  agentsYaml,
  tasksYaml,
  pythonCode,
  mode,
}: ExportModalProps) {
  const [activeTab, setActiveTab] = useState(mode === 'yaml' ? 0 : 2);
  const [yamlTab, setYamlTab] = useState(0);

  const handleDownloadAll = () => {
    const files = activeTab <= 1
      ? [
          { name: 'agents.yaml', content: agentsYaml },
          { name: 'tasks.yaml', content: tasksYaml },
        ]
      : [{ name: 'crew.py', content: pythonCode }];

    files.forEach(({ name, content }) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="export-dialog-title"
    >
      <DialogTitle
        id="export-dialog-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
          Export Crew
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close export dialog">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 3, borderBottom: `1px solid ${COLORS.surface.border}` }}>
        <Tabs
          value={activeTab}
          onChange={(_e, v) => setActiveTab(v)}
          aria-label="Export format tabs"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': { minHeight: 36, fontSize: '0.8rem', textTransform: 'none' },
          }}
        >
          <Tab label="YAML Config" value={0} />
          <Tab label="Python Code" value={2} />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 2 }}>
        {activeTab === 0 && (
          <Box>
            <Tabs
              value={yamlTab}
              onChange={(_e, v) => setYamlTab(v)}
              aria-label="YAML file tabs"
              sx={{
                mb: 2,
                minHeight: 28,
                '& .MuiTab-root': {
                  minHeight: 28,
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.5,
                },
              }}
            >
              <Tab label="agents.yaml" />
              <Tab label="tasks.yaml" />
            </Tabs>
            {yamlTab === 0 && <CodeBlock content={agentsYaml} filename="agents.yaml" />}
            {yamlTab === 1 && <CodeBlock content={tasksYaml} filename="tasks.yaml" />}
          </Box>
        )}

        {activeTab === 2 && (
          <CodeBlock content={pythonCode} filename="crew.py" />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleDownloadAll}
          variant="contained"
          size="small"
          startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
          aria-label="Download all files"
        >
          Download {activeTab === 0 ? 'YAML Files' : 'Python File'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
