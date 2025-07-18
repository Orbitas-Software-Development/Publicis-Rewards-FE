import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../utils/ApiLinks';


export default function AccountPopover() {
  const { user, logout} = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleNavigate = (path: string) => {
    handleClose();
    navigate(path);
  };

  const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;


  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: '2px',
          width: 40,
          height: 40,
          background: (theme) =>
            `conic-gradient(${theme.palette.publicisBlue.light}, ${theme.palette.publicisOrange.light}, ${theme.palette.publicisBlue.light})`,
        }}
      >
        <Avatar src={`${baseUrl}${user?.profilePicture}`} alt={user?.name} sx={{ width: 1, height: 1 }} />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 200 },
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuList sx={{ p: 1, gap: 0.5 }}>
          <MenuItem onClick={() => handleNavigate(`/perfil/${user?.id}`)} sx={{ pl: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon fontSize="small" />
              <Typography variant="subtitle2" >Mi perfil</Typography>
            </Box>
          </MenuItem>

          <MenuItem onClick={() =>  handleNavigate(`/configuracion`)}  sx={{ pl: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SettingsIcon fontSize="small" />
              <Typography variant="subtitle2">Ajustes</Typography>
            </Box>
          </MenuItem>
        </MenuList>



        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            color="primary"
            variant="text"
            onClick={() => {
              handleClose();
              logout();
            }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Popover>
    </>
  );
}
