import { createTheme } from '@mui/material';

export const COLORS = {
  agent: {
    primary: '#F59E0B',
    dark: '#92400E',
    light: '#FEF3C7',
    bg: '#1C1507',
    border: '#D97706',
    headerBg: 'rgba(245, 158, 11, 0.12)',
  },
  task: {
    primary: '#06B6D4',
    dark: '#155E75',
    light: '#CFFAFE',
    bg: '#071318',
    border: '#0891B2',
    headerBg: 'rgba(6, 182, 212, 0.12)',
  },
  begin: {
    primary: '#10B981',
    dark: '#065F46',
    bg: '#071310',
    border: '#059669',
    headerBg: 'rgba(16, 185, 129, 0.12)',
  },
  surface: {
    bg: '#0F172A',
    paper: '#1E293B',
    elevated: '#334155',
    border: '#475569',
    highlight: '#3B4D6B',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    muted: '#64748B',
  },
  accent: {
    blue: '#3B82F6',
    red: '#EF4444',
    green: '#10B981',
  },
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.accent.blue,
    },
    secondary: {
      main: COLORS.agent.primary,
    },
    background: {
      default: COLORS.surface.bg,
      paper: COLORS.surface.paper,
    },
    text: {
      primary: COLORS.text.primary,
      secondary: COLORS.text.secondary,
    },
    error: { main: COLORS.accent.red },
    warning: { main: COLORS.agent.primary },
    info: { main: COLORS.task.primary },
    success: { main: COLORS.begin.primary },
    divider: COLORS.surface.border,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600, fontSize: '1rem' },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 600, fontSize: '0.8125rem' },
    body2: { color: COLORS.text.secondary },
    caption: { fontSize: '0.7rem' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: `${COLORS.surface.elevated} ${COLORS.surface.bg}`,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: COLORS.surface.bg },
          '&::-webkit-scrollbar-thumb': {
            background: COLORS.surface.elevated,
            borderRadius: 3,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none', borderRadius: 12 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundImage: 'none',
          border: `1px solid ${COLORS.surface.border}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: COLORS.surface.elevated,
          border: `1px solid ${COLORS.surface.border}`,
          fontSize: '0.75rem',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: COLORS.surface.border },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': { backgroundColor: `${COLORS.surface.elevated}80` },
        },
      },
    },
  },
});

export default theme;
