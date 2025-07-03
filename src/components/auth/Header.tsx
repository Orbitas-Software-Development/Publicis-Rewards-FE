// src/components/Header.tsx

import { Box, Link, Typography, useTheme } from '@mui/material';
import logo from '../../assets/images/logo3.png'; 

export default function Header() {
  const theme = useTheme();

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0,0,0,0.9)',
        color: theme.palette.publicisGrey.light,
        zIndex: 20,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src={logo}
        alt="Logo de la empresa"
        sx={{ height:{xs:60, sm:70, md:80}, cursor: 'pointer' }}
        onClick={() => window.location.href = '/'}
      />

      {/* Título */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          fontSize: {
            xs: '1rem',   
            sm: '1.2rem',  
            md: '1.5rem',   
          },
          letterSpacing: 1,
          userSelect: 'none',
          textAlign: 'center',
          flexGrow: 1,
          marginLeft: 2,
          marginRight: 2,
          color: theme.palette.publicisGrey.light,
        }}
      >
        Sistema Publicis Rewards
      </Typography>

      {/* Acerca de */}
      <Link
        href="https://www.publicisgroupe.com/en/the-groupe/about-publicis-groupe"
        underline="hover"
        sx={{
          color: theme.palette.publicisGrey.main,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
            fontSize: {
            xs: '0.8rem',   
            sm: '1rem',  
            md: '1.1rem',   
        },
        }}
      >
        Acerca de
      </Link>
    </Box>
  );
}
