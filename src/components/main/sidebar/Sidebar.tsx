import {
  Box,
  Drawer,
  ListItem,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import avatarImage from '../../../assets/images/huella2.png';
import logoImage from '../../../assets/images/logo.png'; 
import { useAuth } from '../../../hooks/useAuth';
import SidebarMenu from './SidebarMenu';


const drawerWidth = 240;

type SidebarProps = {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
};

export default function Sidebar({ mobileOpen, onDrawerToggle }: SidebarProps) {
  const location = useLocation();
  const {user, logout} = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };



  useEffect(() => {
    if (mobileOpen) {
      onDrawerToggle();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        px: 2,
        pt: 2.5,
        pb: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Parte superior: título, usuario y menú */}
      <Box>
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          fontSize={20}
          sx={{ width: '100%', mb: 2.5 }}
        >
          Publicis Rewards
        </Typography>

        {/* Usuario */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            px: 1.5,
            mb: 2,
          }}
        >
          <ListItem
            disableGutters
            sx={{
              px: 0,
              alignItems: 'flex-end',
              display: 'flex',
            }}
          >
            <Avatar
              sx={{ width: 40, height: 40, mr: 1 }}
              src={avatarImage}
              alt={user?.name}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexGrow: 1,
              }}
            >
              <Box>
                <Typography variant="body1" fontWeight={600} fontSize={14}>
                  {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.role.name}
                </Typography>
              </Box>
              <IconButton
                edge="end"
                size="small"
                sx={{ ml: 'auto', alignSelf: 'flex-end' }}
                onClick={handleMenuOpen}
              >
                <MoreVertIcon />
              </IconButton>
               {/* Pop-up Menu */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleProfile}>Ver perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </Menu>
            </Box>
          </ListItem>
        </Box>

        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          sx={{ mb: 1, ml: 0.5 }}
        >
          Menú
        </Typography>

       {/* Navegación */}
        <SidebarMenu role={user?.role.name ?? 'colaborador'} />
      </Box>

      {/* Parte inferior: logo */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <img
          src={logoImage}
          alt="Logo"
          style={{ maxWidth: '100%', height: 60, objectFit: 'contain' }}
        />
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            boxShadow: '1px 0 4px rgba(0,0,0,0.15)', 
          },
        }}
      >
        {drawerContent}
      </Drawer>

    </>
  );
}
