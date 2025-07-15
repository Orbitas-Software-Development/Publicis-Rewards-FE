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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { alpha } from '@mui/material/styles';
import theme from '../../../theme/theme';

interface InviteUserDrawerProps {
  open: boolean;
  onClose: () => void;
  onInvite: (employeeNumber: string) => Promise<void>;
}

export default function InviteUserDrawer({ open, onClose, onInvite }: InviteUserDrawerProps) {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEmployeeNumber('');
      setError(null);
      setSuccessMessage(null);
      setLoading(false);
    }
  }, [open]);

  const handleInviteClick = async () => {
    if (!employeeNumber.trim()) {
      setError('Por favor, ingresa un número de empleado válido.');
      return;
    }

    setError(null);
    setLoading(true);
    setSuccessMessage(null);

    try {
      await onInvite(employeeNumber.trim());
      setSuccessMessage(`Invitación enviada a número de empleado ${employeeNumber.trim()}`);
      setEmployeeNumber('');
    } catch (err) {
      setError((err as Error).message || 'Error al enviar invitación');
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
          Invitar Usuario
        </Typography>
        <IconButton onClick={onClose} aria-label="Cerrar">
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
             Ingresa el número de empleado para enviar la invitación.
        </Typography>
      </Box>

      <TextField
        label="Número de empleado"
        value={employeeNumber}
        onChange={(e) => setEmployeeNumber(e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
        error={!!error}
        helperText={error ?? ' '}
        slotProps={{
            input: {
            'aria-label': 'Número de empleado',
            },
            formHelperText: {
                sx: {
                    fontSize: '0.9rem', 
                    fontWeight: 500,
                },
            },
        }}
        disabled={loading}
      />

      {successMessage && (
        <Alert severity="success" sx={{ mt: 1, mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleInviteClick}
          disabled={loading}
          sx={{ width: '20%', color: theme.palette.publicisGrey.light }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar'}
        </Button>
      </Box>
    </Drawer>
  );
}
