import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Switch,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { alpha } from '@mui/material/styles';
import type { RewardsRole } from '../../../types/RewardsRole';
import theme from '../../../theme/theme';

interface ChangeRoleDialogProps {
  open: boolean;
  onClose: () => void;
  roles: RewardsRole[];
  currentRole: RewardsRole;
  onConfirm: (selectedRole: RewardsRole) => void;
}

export default function ChangeRoleDialog({
  open,
  onClose,
  roles,
  currentRole,
  onConfirm,
}: ChangeRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<RewardsRole>(currentRole);

  useEffect(() => {
    if (open) {
      setSelectedRole(currentRole);
    }
  }, [open, currentRole]);

  const handleConfirm = () => {
    onConfirm(selectedRole);
    onClose();
  };

  // Cuando seleccionas un rol con switch, ese es el único activo
  const handleToggle = (role: RewardsRole) => {
    setSelectedRole(role);
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
         sx: {
            zIndex: 1300, // mayor que 1201 del AppBar
        },
        BackdropProps: {
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.1)',zIndex: 1299  },
        },
      }}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: '80%', md: '55%', lg: '45%', xl: '35%' },
            maxWidth: 500,
            height: 'auto',
            top: 60,            
            left: 0,
            position: 'fixed',
            p: 3,
            boxShadow: 6,
            zIndex: 1301,
          },
        },
      }}
    >
      {/* Header con título y botón cerrar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h3" fontWeight="bold" fontSize={22}>
          Cambiar rol
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      
      <Divider sx={{ mb: 2 }} />

      {/* Subtítulo tipo info similar al otro drawer */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        borderRadius={2}
        mb={3}
        px={2}
        py={1}
        sx={{
          backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.25),
        }}
      >
        <InfoIcon color="primary" />
        <Typography variant="body2" color="black">
          Selecciona el rol que deseas activar para usar la aplicación.
        </Typography>
      </Box>

      {/* Lista vertical de roles con switch */}
      <Box
        border="1px solid"
        borderColor="grey.300"
        borderRadius={2}
        px={2}
        py={1}
        mb={3}
      >
        {roles.map((role) => (
          <Box
            key={role.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={1}
            borderBottom="1px solid"
            borderColor="grey.200"
            sx={{ '&:last-child': { borderBottom: 'none' } }}
          >
            <Box display="flex" alignItems="center" gap={1}>
                <span role="img" aria-label="icon">
                    {role.name === 'Administrador' && '🛡️'}
                    {(role.name === 'Manager' || role.name === 'Supervisor') && '👔'}
                    {role.name === 'Colaborador' && '👤'}
                </span>
                <Typography>{role.name}</Typography>
             </Box>
            <Switch
              checked={selectedRole.id === role.id}
              onChange={() => handleToggle(role)}
              slotProps={{
                 input: {
                    'aria-label': `Seleccionar rol ${role.name}`,
                 },
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Botones cancelar y confirmar */}
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          sx={{ width: '30%', color: theme.palette.publicisGrey.light }}
          disabled={selectedRole.id === currentRole.id}
        >
          Confirmar
        </Button>
      </Box>
    </Drawer>
  );
}
