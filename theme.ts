// src/theme.js
import { createTheme } from '@mui/material/styles';

const primary = {
  50: '#e6fff4',
  100: '#b3ffdf',
  200: '#80ffca',
  300: '#4dffb5',
  400: '#26f5a3',
  500: '#00e091',   // canlı yeşil
  600: '#00b977',
  700: '#00955f',
  800: '#007047',
  900: '#004b2f',
};
const infoBlue = {
  50: '#e8f2ff',
  100: '#c9e0ff',
  200: '#a6ccff',
  300: '#82b7ff',
  400: '#66a7ff',
  500: '#3b8bff',   // canlı mavi
  600: '#2a6dd6',
  700: '#1f54ad',
  800: '#163b7f',
  900: '#0d254f',
};
const secondaryPurple = {
  50: '#f6e8ff',
  100: '#ead0ff',
  200: '#ddb8ff',
  300: '#cf9fff',
  400: '#c58cff',
  500: '#b36bff',   // mor vurgu
  600: '#8e49e6',
  700: '#6f31c0',
  800: '#511f95',
  900: '#361364',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: primary[500] },
    secondary: { main: secondaryPurple[500] },
    info: { main: infoBlue[500] },
    success: { main: primary[500] },
    background: {
      default: '#0b1220', // gradient üstünde görünmez
      paper: 'rgba(255,255,255,0.08)',
    },
    text: {
      primary: '#e8f0ff',
      secondary: '#c7d2fe',
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: `"Inter","Segoe UI","Roboto","Helvetica","Arial",sans-serif`,
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06))',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
        containedPrimary: {
          background:
            'linear-gradient(135deg, #00e091 0%, #3b8bff 50%, #b36bff 100%)',
          color: '#0b1220',
        },
        outlinedPrimary: {
          borderColor: 'rgba(255,255,255,0.35)',
          color: '#e8f0ff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          background:
            'linear-gradient(90deg, rgba(0,224,145,0.2), rgba(59,139,255,0.2), rgba(179,107,255,0.2))',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        },
      },
    },
  },
});

export default theme;
