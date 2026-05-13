import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#c62828',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#e65100',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
    },
    success: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#388e3c',
    },
    background: {
      default: '#0d0d0d',
      paper: '#161616',
    },
    text: {
      primary: '#f0f0f0',
      secondary: '#9e9e9e',
      disabled: '#616161',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600, letterSpacing: '-0.005em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500, letterSpacing: '0.01em' },
    subtitle2: { fontWeight: 500, letterSpacing: '0.01em', color: '#9e9e9e' },
    body1: { letterSpacing: '0.01em' },
    body2: { letterSpacing: '0.01em', color: '#9e9e9e' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em' },
    caption: { letterSpacing: '0.04em', color: '#757575' },
    overline: { letterSpacing: '0.1em', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.4)',
    '0 2px 6px rgba(0,0,0,0.4)',
    '0 4px 12px rgba(0,0,0,0.4)',
    '0 6px 16px rgba(0,0,0,0.45)',
    '0 8px 20px rgba(0,0,0,0.5)',
    '0 10px 24px rgba(0,0,0,0.5)',
    '0 12px 28px rgba(0,0,0,0.55)',
    '0 14px 32px rgba(0,0,0,0.55)',
    '0 16px 36px rgba(0,0,0,0.6)',
    '0 18px 40px rgba(0,0,0,0.6)',
    '0 20px 44px rgba(0,0,0,0.65)',
    '0 22px 48px rgba(0,0,0,0.65)',
    '0 24px 52px rgba(0,0,0,0.7)',
    '0 26px 56px rgba(0,0,0,0.7)',
    '0 28px 60px rgba(0,0,0,0.75)',
    '0 30px 64px rgba(0,0,0,0.75)',
    '0 32px 68px rgba(0,0,0,0.8)',
    '0 34px 72px rgba(0,0,0,0.8)',
    '0 36px 76px rgba(0,0,0,0.85)',
    '0 38px 80px rgba(0,0,0,0.85)',
    '0 40px 84px rgba(0,0,0,0.9)',
    '0 42px 88px rgba(0,0,0,0.9)',
    '0 44px 92px rgba(0,0,0,0.95)',
    '0 46px 96px rgba(0,0,0,0.95)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#333 #111',
          '&::-webkit-scrollbar': { width: '6px', height: '6px' },
          '&::-webkit-scrollbar-track': { background: '#111' },
          '&::-webkit-scrollbar-thumb': {
            background: '#333',
            borderRadius: '3px',
            '&:hover': { background: '#555' },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '9px 20px',
          fontWeight: 600,
          transition: 'all 0.2s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#161616',
          border: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#161616',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.03)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(102,187,106,0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#66bb6a',
              borderWidth: '1.5px',
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.12)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#66bb6a',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.125rem',
          fontWeight: 700,
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { padding: '24px' },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          gap: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,255,255,0.06)',
          padding: '12px 16px',
        },
        head: {
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#757575',
          backgroundColor: '#111',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.06)' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.08)',
          height: 6,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2a2a2a',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 8,
        },
        arrow: { color: '#2a2a2a' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '2px 4px',
          '&:hover': { backgroundColor: 'rgba(102,187,106,0.1)' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(102,187,106,0.15)',
            '&:hover': { backgroundColor: 'rgba(102,187,106,0.2)' },
          },
        },
      },
    },
  },
});
