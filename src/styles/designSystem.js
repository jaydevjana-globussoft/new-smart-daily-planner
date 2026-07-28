import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7C5CFC', // Vibrant Warm Purple Accent
      light: '#A855F7',
      dark: '#5B3BD4',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FF7A59', // Warm Coral Highlight Accent
      light: '#FF957A',
      dark: '#E55C3A',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#22C55E',
      light: '#4ADE80',
      dark: '#16A34A'
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706'
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626'
    },
    background: {
      default: '#FFF8FC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#1F2937',   // Dark Slate Gray for maximum contrast & crisp legibility
      secondary: '#6B7280' // Muted Slate Gray for subtitles & captions
    }
  },
  typography: {
    fontFamily: ['Plus Jakarta Sans', '-apple-system', 'sans-serif'].join(','),
    h1: { fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#1F2937' },
    h2: { fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#1F2937' },
    h3: { fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#1F2937' },
    h4: { fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#1F2937' },
    h5: { fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#1F2937' },
    h6: { fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#1F2937' },
    button: { textTransform: 'none', fontWeight: 700 }
  },
  shape: {
    borderRadius: 20
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: '8px 20px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          boxShadow: '8px 8px 24px rgba(124, 92, 252, 0.08), -8px -8px 20px #FFFFFF',
          border: '1px solid rgba(124, 92, 252, 0.12)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(124, 92, 252, 0.16)',
          boxShadow: '0 20px 50px rgba(124, 92, 252, 0.15)',
          borderRadius: 24
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 14,
            backgroundColor: '#F8F4FF',
            boxShadow: 'inset 3px 3px 8px rgba(124, 92, 252, 0.09), inset -3px -3px 8px #FFFFFF',
            color: '#1F2937',
            '& fieldset': {
              border: 'none'
            },
            '&:hover fieldset': {
              border: 'none'
            },
            '&.Mui-focused fieldset': {
              border: '1.5px solid #7C5CFC'
            }
          }
        }
      }
    }
  }
});
