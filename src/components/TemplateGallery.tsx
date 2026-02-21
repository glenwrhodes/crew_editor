import {
  Box, Typography, Card, CardContent, CardActions, Button,
  Chip, Stack, Dialog, DialogTitle, DialogContent, IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { CREW_TEMPLATES, CrewTemplate } from '../utils/templates';
import { COLORS } from '../theme';

interface TemplateGalleryProps {
  onSelectTemplate: (template: CrewTemplate) => void;
}

function TemplateCard({ template, onSelect }: { template: CrewTemplate; onSelect: () => void }) {
  return (
    <Card
      aria-label={`Template: ${template.name}`}
      sx={{
        bgcolor: COLORS.surface.paper,
        border: `1px solid ${COLORS.surface.border}50`,
        borderRadius: '14px',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          border: `1px solid ${template.accentColor}60`,
          boxShadow: `0 4px 20px ${template.accentColor}15`,
          transform: 'translateY(-2px)',
        },
      }}
      onClick={onSelect}
    >
      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: `${template.accentColor}15`,
              border: `1px solid ${template.accentColor}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              flexShrink: 0,
            }}
          >
            {template.icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: COLORS.text.primary, fontSize: '0.9rem', lineHeight: 1.3 }}
            >
              {template.name}
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
              <Chip
                icon={<PersonIcon sx={{ fontSize: 12 }} />}
                label={`${template.agentCount}`}
                size="small"
                aria-label={`${template.agentCount} agents`}
                sx={{
                  height: 20,
                  fontSize: '0.6rem',
                  bgcolor: `${COLORS.agent.primary}15`,
                  color: COLORS.agent.primary,
                  border: `1px solid ${COLORS.agent.primary}30`,
                  '& .MuiChip-label': { px: 0.5 },
                  '& .MuiChip-icon': { color: COLORS.agent.primary, ml: 0.5 },
                }}
              />
              <Chip
                icon={<AssignmentIcon sx={{ fontSize: 12 }} />}
                label={`${template.taskCount}`}
                size="small"
                aria-label={`${template.taskCount} tasks`}
                sx={{
                  height: 20,
                  fontSize: '0.6rem',
                  bgcolor: `${COLORS.task.primary}15`,
                  color: COLORS.task.primary,
                  border: `1px solid ${COLORS.task.primary}30`,
                  '& .MuiChip-label': { px: 0.5 },
                  '& .MuiChip-icon': { color: COLORS.task.primary, ml: 0.5 },
                }}
              />
            </Stack>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: COLORS.text.secondary,
            fontSize: '0.75rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {template.description}
        </Typography>

        <Stack direction="row" spacing={0.5} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
          {template.tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.55rem',
                bgcolor: `${COLORS.surface.elevated}50`,
                color: COLORS.text.muted,
                border: `1px solid ${COLORS.surface.border}30`,
                '& .MuiChip-label': { px: 0.6 },
              }}
            />
          ))}
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 1.5, pt: 0 }}>
        <Button
          size="small"
          fullWidth
          variant="outlined"
          startIcon={<RocketLaunchIcon sx={{ fontSize: 14 }} />}
          aria-label={`Use ${template.name} template`}
          sx={{
            fontSize: '0.75rem',
            color: template.accentColor,
            borderColor: `${template.accentColor}40`,
            '&:hover': {
              borderColor: template.accentColor,
              bgcolor: `${template.accentColor}10`,
            },
          }}
        >
          Use Template
        </Button>
      </CardActions>
    </Card>
  );
}

export function WelcomeScreen({ onSelectTemplate }: TemplateGalleryProps) {
  return (
    <Box
      aria-label="Welcome screen - choose a template or start from scratch"
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          pointerEvents: 'auto',
          maxWidth: 820,
          width: '100%',
          px: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              bgcolor: `${COLORS.accent.blue}15`,
              border: `1px solid ${COLORS.accent.blue}30`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: COLORS.accent.blue }}>
              C
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.75 }}>
            CrewAI Visual Editor
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary, fontSize: '0.85rem' }}>
            Build complex AI agent crews visually. Start with a template or drag nodes from the sidebar.
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: COLORS.text.muted,
            fontSize: '0.6rem',
            mb: 1.5,
            display: 'block',
          }}
        >
          Quick Start Templates
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
            gap: 2,
          }}
        >
          {CREW_TEMPLATES.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => onSelectTemplate(template)}
            />
          ))}
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="caption" sx={{ color: COLORS.text.muted, fontSize: '0.7rem' }}>
            Or drag a Start, Agent, or Task node from the sidebar to begin from scratch
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export function TemplateModal({
  open,
  onClose,
  onSelectTemplate,
}: TemplateGalleryProps & { open: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="template-dialog-title"
    >
      <DialogTitle
        id="template-dialog-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
            Crew Templates
          </Typography>
          <Typography variant="caption" sx={{ color: COLORS.text.muted }}>
            Start with a pre-built crew and customize it to your needs
          </Typography>
        </Box>
        <Tooltip title="Close">
          <IconButton onClick={onClose} size="small" aria-label="Close templates dialog">
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            pt: 1,
          }}
        >
          {CREW_TEMPLATES.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => {
                onSelectTemplate(template);
                onClose();
              }}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
