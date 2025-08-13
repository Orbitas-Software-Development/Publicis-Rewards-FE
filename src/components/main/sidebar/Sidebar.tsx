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
import logoImage from '../../../assets/images/logo2.png'; 
import { useAuth } from '../../../hooks/useAuth';
import SidebarMenu from './SidebarMenu';
import { API_URL } from '../../../utils/ApiLinks';
import ChangeRoleDialog from './ChangeRoleDialog';
import type { RewardsRole } from '../../../types/RewardsRole';

const drawerWidth = 240;

type SidebarProps = {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
};

export default function Sidebar({ mobileOpen, onDrawerToggle }: SidebarProps) {
  const location = useLocation();
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isProfilePage = location.pathname === `/perfil/${user?.id}`;

  const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate(`/perfil/${user?.id}`);
  };

  const handleChangeRoleModal = () => {
  handleMenuClose();
  setRoleDialogOpen(true);
};

  const handleRoleChangeConfirm = (selectedRole: RewardsRole) => {
  if (!selectedRole || !user) return;

  const updatedUser = { ...user, activeRole: selectedRole };
  localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  window.location.reload();
};

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/iniciar-sesion');
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
            borderColor: isProfilePage ? 'primary.main' : 'divider',
            borderRadius: 2,
            px: 1,
            mb: 2,
            bgcolor: isProfilePage ? 'action.selected' : 'transparent',
          }}
        >
          <ListItem disableGutters sx={{ px: 0, alignItems: 'center', display: 'flex' }}>
            <Avatar
              sx={{ width: 40, height: 40, mr: 1 }}
              src={`${baseUrl}${user?.profilePicture}`}
              alt={user?.name}
            />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1" fontWeight={600} fontSize={14}>
                {user?.name}
              </Typography>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {user?.activeRole.name}
                </Typography>

                <IconButton
                  edge="end"
                  size="small"
                  onClick={handleMenuOpen}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Pop-up Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleProfile}>
                <Typography variant="subtitle1">Ver perfil</Typography>
              </MenuItem>
              {user && user.roles.length > 1 && (
                <MenuItem onClick={handleChangeRoleModal}>
                  <Typography variant="subtitle1">Cambiar rol</Typography>
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>
                <Typography variant="subtitle1">Cerrar sesión</Typography>
              </MenuItem>
            </Menu>
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
        <SidebarMenu role={user?.activeRole?.name ?? 'colaborador'} />
      </Box>

      {/* Parte inferior: logo */}
      <Box sx={{ textAlign: 'center', mt: 2, cursor:'pointer' }} onClick={() => window.location.reload()}  role="button" >
        <img
          src={logoImage}
          alt="Logo"
          style={{ maxWidth: '100%', height: 80, objectFit: 'contain' }}
        />
      </Box>
        {user && user.activeRole && (
          <ChangeRoleDialog
            open={roleDialogOpen}
            onClose={() => setRoleDialogOpen(false)}
            roles={user.roles}
            currentRole={user.activeRole}
            onConfirm={handleRoleChangeConfirm}
          />
        )}

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
           '& .MuiDrawer-paper': { width: drawerWidth, top: '56px', height: 'calc(100% - 56px)' },
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
