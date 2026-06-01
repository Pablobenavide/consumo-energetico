import { createTheme } from '@mui/material/styles';

export const energyTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#9be15d' },
    secondary: { main: '#0ea5e9' },
    background: {
      default: '#07111f',
      paper: 'rgba(10, 20, 35, 0.88)',
    },
    text: {
      primary: '#eff6ff',
      secondary: '#b6c2d4',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h2: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundImage: 'linear-gradient(180deg, rgba(15,23,42,0.92), rgba(7,17,31,0.92))',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
  },
});