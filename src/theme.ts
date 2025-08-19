'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007bff',
      light: '#3d95ff',
      dark: '#0056b3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6c757d',
      light: '#9ca3af',
      dark: '#495057',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      disabled: '#9ca3af',
    },
    divider: '#e5e7eb',
    action: {
      hover: 'rgba(0, 123, 255, 0.04)',
      selected: 'rgba(0, 123, 255, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.2,
      color: '#1a1a1a',
      marginBottom: '0.5rem',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.3,
      color: '#1a1a1a',
      marginBottom: '0.5rem',
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#1a1a1a',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#666666',
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: '#9ca3af',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: 0,
    },
    caption: {
      fontSize: '0.75rem',
      color: '#9ca3af',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:focus': {
            boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.5)',
          },
        },
        contained: {
          backgroundColor: '#007bff',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#0056b3',
          },
        },
        outlined: {
          borderColor: '#e5e7eb',
          color: '#374151',
          backgroundColor: '#ffffff',
          '&:hover': {
            backgroundColor: '#f9fafb',
            borderColor: '#d1d5db',
          },
        },
        text: {
          color: '#666666',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            fontSize: '0.875rem',
            '& fieldset': {
              borderColor: '#e5e7eb',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: '#d1d5db',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007bff',
              borderWidth: '2px',
            },
            '& input': {
              padding: '12px 16px',
            },
            '& textarea': {
              padding: '12px 16px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#1a1a1a',
            '&.Mui-focused': {
              color: '#007bff',
            },
          },
          '& .MuiFormHelperText-root': {
            fontSize: '0.75rem',
            color: '#9ca3af',
            marginTop: '4px',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          fontSize: '0.875rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e5e7eb',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d1d5db',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#007bff',
            borderWidth: '2px',
          },
        },
        select: {
          padding: '12px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f9fafb',
          borderRight: '1px solid #e5e7eb',
          boxShadow: 'none',
          borderRadius: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 123, 255, 0.08)',
            color: '#007bff',
            '&:hover': {
              backgroundColor: 'rgba(0, 123, 255, 0.12)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.875rem',
          fontWeight: 400,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '32px',
          color: 'inherit',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e5e7eb',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 500,
        },
        filled: {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          '&:hover': {
            backgroundColor: '#e5e7eb',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1f2937',
          fontSize: '0.75rem',
          borderRadius: '6px',
          padding: '8px 12px',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: '#007bff',
                opacity: 1,
                border: 0,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: '#007bff',
              border: '6px solid #fff',
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#e5e7eb',
            opacity: 1,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#666666',
          '&.Mui-selected': {
            color: '#007bff',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#007bff',
        },
      },
    },
  },
});

export default theme;