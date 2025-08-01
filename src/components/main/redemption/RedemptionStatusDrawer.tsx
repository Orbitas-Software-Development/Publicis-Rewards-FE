import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  type SxProps,
  type Theme,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../../theme/theme';
import PendingIcon from '@mui/icons-material/AccessTime';
import ConfirmedIcon from '@mui/icons-material/CheckCircle';
import CancelledIcon from '@mui/icons-material/Cancel';

interface Props {
  open: boolean;
  onClose: () => void;
  redemptionId: number | null; 
  userName: string;
  currentStatus: string;
  onSave: (newStatus: string) => Promise<void>; 
}

const statusIcons = {
  Pendiente: <PendingIcon color="warning" sx={{ mr: 1 }} />,
  Entregado: <ConfirmedIcon color="success" sx={{ mr: 1 }} />,
  Anulado: <CancelledIcon color="error" sx={{ mr: 1 }} />,
};


const getStatusColor = (status: string): SxProps<Theme> => {
  switch (status) {
    case 'Pendiente':
      return { color: theme.palette.warning.main };
    case 'Entregado':
      return { color: theme.palette.success.main };
    case 'Anulado':
      return { color: theme.palette.error.main };
    default:
      return { color: theme.palette.text.primary };
  }
};

const RedemptionStatusDrawer: React.FC<Props> = ({
  open,
  onClose,
  redemptionId,
  userName,
  currentStatus,
  onSave
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  React.useEffect(() => {
    if (open) setSelectedStatus(currentStatus);
  }, [open, currentStatus]);

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
  };

  const handleConfirmSave = () => {
    setConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
  };

  const handleSaveStatus = async () => {
    if (!redemptionId) return;
        setIsSaving(true);
        setConfirmOpen(false);
    try {
        await onSave(selectedStatus);
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
          BackdropProps: { sx: { backgroundColor: 'rgba(0,0,0,0.1)' } },
        }}
        slotProps={{
            paper: {
                sx: {
                width: { xs: '100%', sm: '80%', md: '45%', lg: '35%' },
                maxWidth: 600,
                top: { xs: '20vh', md: '25vh', lg: '30vh' },
                bottom: { xs: '5vh', md: '10vh' },
                height: 'auto',
                position: 'fixed',
                right: 0,
                boxShadow: 6,
                p: 3,
                zIndex: (theme) => theme.zIndex.modal + 5,
                overflowY: 'auto',
                },
            },
         }}

      >
         {/* Contenido principal */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h3" fontWeight="bold" fontSize={22}>
                Cambiar estado de canje
            </Typography>
            <IconButton onClick={onClose}>
                <CloseIcon />
            </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle1" mb={3}>
                Modificando el estado del canje con ID <strong>{redemptionId}</strong>, correspondiente al usuario: <strong>{userName}.</strong>
            </Typography>

            <Box mb={4}>
                <Typography variant="body1" mb={1}>
                    Estado actual:
                </Typography>
                <Select
                    fullWidth
                    value={selectedStatus}
                    onChange={handleChangeStatus}
                    disabled={isSaving}
                    sx={{
                        fontWeight: 'bold',
                        '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: theme.palette.text.primary,
                        },
                    }}
                    renderValue={(value) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {statusIcons[value as keyof typeof statusIcons]}
                        <Typography sx={getStatusColor(value)}>{value}</Typography>
                        </Box>
                    )}
                    >
                    <MenuItem value="Pendiente" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {statusIcons.Pendiente}
                        <Typography sx={{ color: theme.palette.warning.main }}>Pendiente</Typography>
                    </MenuItem>
                    <MenuItem value="Entregado" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {statusIcons.Entregado}
                        <Typography sx={{ color: theme.palette.success.main }}>Entregado</Typography>
                    </MenuItem>
                    <MenuItem value="Anulado" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {statusIcons.Anulado}
                        <Typography sx={{ color: theme.palette.error.main }}>Anulado</Typography>
                    </MenuItem>
                </Select>
            </Box>
        </Box>

        {/* Botones abajo */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button variant="outlined" onClick={onClose} disabled={isSaving}>
             Cancelar
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmSave}
                sx={{width: '30%', color: theme.palette.publicisGrey.light }}
                disabled={isSaving || selectedStatus === currentStatus}
            >
            {isSaving ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
                'Guardar cambios'
            )}
            </Button>
        </Box>
      </Drawer>

      {/* Dialogo de confirmacion */}
      <Dialog open={confirmOpen} onClose={handleCancelConfirm}>
        <DialogTitle>Confirmar cambio de estado</DialogTitle>
        <DialogContent>
            <DialogContentText>
                ¿Estás seguro que deseas cambiar el estado del canje con ID: <strong>{redemptionId}</strong>, correspondiente al usuario <strong>{userName}</strong>, al estado{' '}
                <Box component="span" sx={{...getStatusColor(selectedStatus), fontWeight: 'bold'}}>
                    {selectedStatus}
                </Box>?
                {selectedStatus === 'Anulado' && (
                    <Box component="span" ml={0.5}>
                      Esta acción es importante y modificará información del sistema.
                    </Box>
                )}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm} disabled={isSaving}>Cancelar</Button>
          <Button
            onClick={handleSaveStatus}
            variant="contained"
            color={selectedStatus === 'Anulado' ? 'error' : 'primary'}
            disabled={isSaving}
            sx={{color:theme.palette.publicisGrey.light}}
            >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RedemptionStatusDrawer;
