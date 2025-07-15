import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Switch,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { alpha } from '@mui/material/styles';
import theme from '../../../theme/theme';

interface RewardsRole {
  id: number;
  name: string;
}

interface AddUserDrawerProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (employeeNumber: string, roles: RewardsRole[]) => Promise<void>;
  availableRoles?: RewardsRole[];
}

const defaultRoles: RewardsRole[] = [
  { id: 1, name: 'Administrador' },
  { id: 2, name: 'Manager/Supervisor' },
  { id: 3, name: 'Colaborador' },
];

export default function AddUserDrawer({
  open,
  onClose,
  onAddUser,
  availableRoles = defaultRoles,
}: AddUserDrawerProps) {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [inputError, setInputError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setEmployeeNumber('');
      setSelectedRoles([]);
      setInputError(null);
      setGeneralError(null);
      setLoading(false);
    }
  }, [open]);

  const toggleRole = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleAddUserClick = async () => {
    setInputError(null);
    setGeneralError(null);

    if (!employeeNumber.trim()) {
      setInputError('Por favor, ingresa un número de empleado válido.');
      return;
    }
    if (selectedRoles.length === 0) {
      setGeneralError('Debes seleccionar al menos un rol.');
      return;
    }

    setLoading(true);

    try {
      await onAddUser(
        employeeNumber.trim(),
        availableRoles.filter((r) => selectedRoles.includes(r.id))
      );
      setEmployeeNumber('');
      setSelectedRoles([]);
    } catch (err) {
      setGeneralError((err as Error).message || 'Error al añadir usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
        sx: { zIndex: 1400 },
        BackdropProps: { sx: { backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 1399 } },
      }}
      slotProps={{
        paper: {
          sx: {
            position: 'fixed',
            top: 60,
            right: {xs:0, md:20},
            left: 'auto',
            width: { xs: '100%', sm: '80%', md: '55%', lg: '45%', xl: '35%' },
            maxWidth: 480,
            height: 'auto',
            boxShadow: 6,
            borderRadius: 2,
            p: 3,
            zIndex: 1401,
          },
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h3" fontWeight="bold" fontSize={22}>
          Añadir Usuario
        </Typography>
        <IconButton onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

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
          Ingresa el número de empleado y asigna los roles correspondientes.
        </Typography>
      </Box>

      <TextField
        label="Número de empleado"
        value={employeeNumber}
        onChange={(e) => setEmployeeNumber(e.target.value)}
        fullWidth
        variant="outlined"
        size="medium"
        error={!!inputError}
        helperText={inputError ?? ' '}
        disabled={loading}
        slotProps={{
          input: { 'aria-label': 'Número de empleado' },
          formHelperText: {
            sx: { fontSize: '0.9rem', fontWeight: 500, mb: 1 },
          },
        }}
        sx={{
          '& .MuiInputBase-root': {
            height: 56,
          },
          '& .MuiInputBase-input': {
            padding: '16.5px 14px',
            display: 'flex',
            alignItems: 'center',
          },
        }}
      />

      <Box
        border="1px solid"
        borderColor="grey.300"
        borderRadius={2}
        px={2}
        py={1}
        mb={2}
      >
        {availableRoles.map((role) => (
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
                {role.name === 'Manager/Supervisor' && '👔'}
                {role.name === 'Colaborador' && '👤'}
              </span>
              <Typography>{role.name}</Typography>
            </Box>
            <Switch
              checked={selectedRoles.includes(role.id)}
              onChange={() => toggleRole(role.id)}
              disabled={loading}
              slotProps={{
                input: {
                  'aria-label': `Seleccionar rol ${role.name}`,
                },
              }}
            />
          </Box>
        ))}
      </Box>

      {generalError && (
        <Alert
          severity="error"
          sx={{ mb: 2, backgroundColor: theme.palette.error.light, color: theme.palette.publicisBlack.main }}
        >
          {generalError}
        </Alert>
      )}


      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUserClick}
          disabled={loading}
          sx={{ width: '30%', color: theme.palette.publicisGrey.light }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Añadir'}
        </Button>
      </Box>
    </Drawer>
  );
}
