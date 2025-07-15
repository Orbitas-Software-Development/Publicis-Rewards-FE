import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Divider,
  Switch,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { alpha } from '@mui/material/styles';
import { useUsers } from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import type { RewardsUser } from '../../../types/RewardsUser';
import type { RewardsRole } from '../../../types/RewardsRole';
import theme from '../../../theme/theme';

interface Props {
  open: boolean;
  onClose: () => void;
  user: RewardsUser | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

const RoleManagerDrawer: React.FC<Props> = ({
  open,
  onClose,
  user,
  onError,
  onSuccess,
}) => {
  const { assignUserRoles } = useUsers();
  const { updateUserRoles } = useAuth();
  const [assignedRoles, setAssignedRoles] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const dynamicRolesList: RewardsRole[] = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: user?.isManager ? 'Manager' : 'Supervisor' },
    { id: 3, name: 'Colaborador' },
  ];

  useEffect(() => {
    if (user) {
      const current = user.roles.map((r) => r.id);
      setAssignedRoles(current.length > 0 ? current : [3]);
    }
  }, [user]);

  const toggleRole = (roleId: number) => {
    setAssignedRoles((prev) => {
      if (prev.includes(roleId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const handleSave = async () => {
    if (!user) return;

    const selectedRoles: RewardsRole[] = dynamicRolesList.filter((role) =>
      assignedRoles.includes(role.id)
    );

    try {
      setIsSaving(true);
      const msg = await assignUserRoles(user.id, selectedRoles);

      const localUserRaw = localStorage.getItem('auth_user');
      if (localUserRaw) {
        const localUser = JSON.parse(localUserRaw);
        if (localUser.id === user.id) {
          updateUserRoles(selectedRoles);
        }
      }

      onSuccess?.(msg);
      onClose();
    } catch (err) {
      onError?.((err as Error).message ?? 'Ocurrió un error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
        BackdropProps: {
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
        },
      }}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: '80%', md: '55%', lg: '45%', xl: '35%' },
            maxWidth: '600px',
            height: 'auto',
            top: {
              xs: '15vh',
              sm: '20vh',
              md: '25vh',
              lg: '30vh',
              xl: '45vh',
            },
            position: 'fixed',
            right: 0,
            boxShadow: 6,
            p: 3,
            zIndex: (theme) => theme.zIndex.modal + 5,
          },
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h3" fontWeight="bold" fontSize={22}>
          Gestionar roles
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

     <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
        mb={3}
      >
        <Avatar src={user.profilePicture ?? undefined} sx={{ width: 56, height: 56 }} />
        <Box 
          flex={1}
          sx={{
            width: '100%',
            textAlign: { xs: 'center', sm: 'left' },
          }}>
          <Typography fontWeight={600}>{user.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          sx={{
            alignSelf: { xs: 'center', sm: 'center' },
            mt: { xs: 1, sm: 0 },
          }}
          onClick={() => {
            navigate(`/perfil/${user.id}`);
            onClose();
          }}
        >
          Ver perfil
        </Button>
      </Box>


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
          Selecciona los roles del usuario. Debe tener al menos uno activo.
        </Typography>
      </Box>

      <Box
        border="1px solid"
        borderColor="grey.300"
        borderRadius={2}
        px={2}
        mb={2}
      >
        {dynamicRolesList.map((role) => (
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
              checked={assignedRoles.includes(role.id)}
              onChange={() => toggleRole(role.id)}
            />
          </Box>
        ))}
      </Box>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ width: '30%', color: theme.palette.publicisGrey.light }}
          disabled={isSaving}
        >
          {isSaving ? (
            <CircularProgress size={24} sx={{ color: theme.palette.publicisGrey.light }} />
          ) : (
            'Guardar'
          )}
        </Button>
      </Box>
    </Drawer>
  );
};

export default RoleManagerDrawer;
