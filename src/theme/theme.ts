import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    publicisBlack: {
      main: '#212129',
      light: '#3d3d48',
      dark: '#0d0d13',
      contrastText: '#ffffff',
    },
    publicisGrey: {
      main: '#E7E7E7',
      light: '#ffffff',
      dark: '#cfcfcf',
      contrastText: '#000000',
    },
    publicisGold: {
      main: '#9D833E',
      light: '#c6a959',
      dark: '#6d5c2c',
      contrastText: '#000000',
    },
    publicisBlue: {
      main: '#16ABE0',
      light: '#5bd0f3',
      dark: '#007aa8',
      contrastText: '#ffffff',
    },
    publicisPink: {
      main: '#D93D7A',
      light: '#ff71a7',
      dark: '#a2004f',
      contrastText: '#ffffff',
    },
    publicisTurquoise: {
      main: '#00B0A3',
      light: '#5fe3d6',
      dark: '#008073',
      contrastText: '#000000',
    },

    // Mapas estándar de MUI
    primary: {
      main: '#16ABE0', // Publicis Blue
    },
    secondary: {
      main: '#9D833E', // Publicis Gold
    },
    error: {
      main: '#D93D7A', // Publicis Pink
    },
    warning: {
      main: '#9D833E', // Publicis Gold
    },
    info: {
      main: '#00B0A3', // Publicis Turquoise
    },
    success: {
      main: '#00B0A3', // Publicis Turquoise
    },
  },
typography: {
  // Fuente general para todo
  fontFamily: ['Gotham Narrow', 'Arial', 'sans-serif'].join(','),

  // Títulos principales con ITC New Baskerville Roman
  h1: {
    fontFamily: ['ITC New Baskerville Roman', 'Georgia', 'serif'].join(','),
    fontWeight: 400,
    fontSize: '55px'
  },
  h2: {
    fontFamily: ['ITC New Baskerville Roman'].join(','),
    fontWeight: 400,
    fontSize: '45px'
  },
  h3: {
    fontFamily: ['ITC New Baskerville Roman', 'Georgia', 'serif'].join(','),
    fontWeight: 400,
    fontSize: '35px'
  },

  // Subtítulos y texto normal con Gotham Narrow
  subtitle1: {
    fontFamily: ['Gotham Narrow Bold', 'Arial', 'sans-serif'].join(','),
  },
  subtitle2: {
    fontFamily: ['Gotham Narrow', 'Arial', 'sans-serif'].join(','),
    fontWeight: 500, // Medium
  },
  body1: {
    fontFamily: ['Gotham Narrow', 'Arial', 'sans-serif'].join(','),
    fontWeight: 400, // Book
  },
  body2: {
    fontFamily: ['ITC New Baskerville Roman', 'Arial', 'sans-serif'].join(','),
    fontWeight: 300, 
  },
  caption: {
    fontFamily: ['ITC New Baskerville Roman', 'Arial', 'sans-serif'].join(','),
    fontWeight: 200, 
  },
  button: {
    fontFamily: ['Gotham Narrow', 'Arial', 'sans-serif'].join(','),
    fontWeight: 500, 
    textTransform: 'none',
  },
},

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Extender el tipo de tema para incluir los colores personalizados
declare module '@mui/material/styles' {
  interface Palette {
    publicisBlack: Palette['primary'];
    publicisGrey: Palette['primary'];
    publicisGold: Palette['primary'];
    publicisBlue: Palette['primary'];
    publicisPink: Palette['primary'];
    publicisTurquoise: Palette['primary'];
  }
  interface PaletteOptions {
    publicisBlack?: PaletteOptions['primary'];
    publicisGrey?: PaletteOptions['primary'];
    publicisGold?: PaletteOptions['primary'];
    publicisBlue?: PaletteOptions['primary'];
    publicisPink?: PaletteOptions['primary'];
    publicisTurquoise?: PaletteOptions['primary'];
  }
}

export default theme;
