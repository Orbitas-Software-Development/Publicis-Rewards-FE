import { alpha, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
      background: {
      default: '#F4F6F8', 
      paper: '#ffffff',   
    },
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
      main: '#BDAB78',
      light: '#DCD1B5',
      dark: '#6d5c2c',
      contrastText: '#000000',
    },
    publicisBlue: {
      main: '#16ABE0',
      light: '#5bd0f3',
      dark: '#007aa8',
      contrastText: '#ffffff',
    },
    publicisOrange: {
      main: '#FC8B3C',
      light: '#FFA178',
      dark: '#B65B19',
      contrastText: '#ffffff',
    },
    publicisPurple: {
      main: '#B96EFF',
      light: '#ff71a7',
      dark: '#7030A0',
      contrastText: '#ffffff',
    },
    publicisTurquoise: {
      main: '#0EBAC5',
      light: '#0EE2DA',
      dark: '#097E87',
      contrastText: '#000000',
    },

    primary: {
      main: '#16ABE0', 
    },
    secondary: {
      main: '#9D833E', 
    },
    error: {
      light: '#FF563028',
      main: '#CC0028',
      dark: '#A30020',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#9D833E',    
      light: '#FFE399',    
      dark: '#5C4A1F',      
    },
    info: {
      main: '#0EBAC5', 
    },
    success: {
      light: '#22C55E28',
      main: '#22C55E',
      dark: '#118D57',
      contrastText: '#ffffff',
    },
    action: {
      selected: alpha('#16ABE0', 0.12), 
      hover: alpha('#16ABE0', 0.06),    
      focus: alpha('#00B0A3', 0.12), 
    },
  },
typography: {
  fontFamily: ['Gotham Narrow', 'Arial', 'sans-serif'].join(','),

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
    publicisOrange: Palette['primary'];
     publicisPurple: Palette['primary'];
    publicisTurquoise: Palette['primary'];
  }
  interface PaletteOptions {
    publicisBlack?: PaletteOptions['primary'];
    publicisGrey?: PaletteOptions['primary'];
    publicisGold?: PaletteOptions['primary'];
    publicisBlue?: PaletteOptions['primary'];
    publicisOrange?: PaletteOptions['primary'];
       publicisPurple: Palette['primary'];
    publicisTurquoise?: PaletteOptions['primary'];
  }
}

export default theme;
