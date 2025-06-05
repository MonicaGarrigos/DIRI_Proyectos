import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8e44ad' 
    },
    secondary: {
      main: '#27ae60' 
    },
    background: {
      default: '#f7f8fc',
      paper: '#ffffff'
    },
    text: {
      primary: '#1e1e2f',
      secondary: '#555'
    }
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e1e2f',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: '600',
        }
      }
    }
  }
});

export default theme;
