// src/layouts/DashboardLayout.tsx
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from '../components/main/sidebar/Sidebar';
import MainHeader from '../components/main/header/MainHeader';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const drawerWidth = 240;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };
  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      bgcolor: theme.palette.background.default,
      overflow: 'hidden'
    }}>
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerClose} />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          ...(isDesktop && {
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }),
          ...(isDesktop === false && {
            width: '100%',
            ml: 0,
          }),
        }}
      >
        <MainHeader
          onMenuClick={handleDrawerToggle} 
          sidebarOpen={mobileOpen}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}