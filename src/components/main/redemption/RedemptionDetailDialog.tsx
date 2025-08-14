import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  useMediaQuery,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../../theme/theme';
import type { RedemptionsHistoryDto } from '../../../types/RedemptionsHistoryDto';

interface RedemptionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  redemption: RedemptionsHistoryDto | null;
}

const RedemptionDetailDialog: React.FC<RedemptionDetailDialogProps> = ({
  open,
  onClose,
  redemption,
}) => {
  const isSmallScreen = useMediaQuery('(max-width:700px)');

  if (!redemption) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            p: 3,
          },
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h3" fontWeight="bold" fontSize={22}>
          Detalle del Canje
        </Typography>
        <IconButton onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          Estado actual
        </Typography>
        <Typography sx={{ mb: 2 }}>{redemption.status}</Typography>

        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          Cambiado por
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {redemption.changedBy || 'Desconocido'}
        </Typography>

        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          Fecha del cambio
        </Typography>
        <Typography>
          {redemption.changedAt
            ? new Date(redemption.changedAt).toLocaleString()
            : 'N/D'}
        </Typography>

        <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mt={2}>
          Premio
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {redemption.prizeName}
        </Typography>

        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          Huellas usadas
        </Typography>
        <Typography>{redemption.pointsUsed}</Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          fullWidth={isSmallScreen}
          sx={{ color: theme.palette.publicisGrey.light }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RedemptionDetailDialog;
