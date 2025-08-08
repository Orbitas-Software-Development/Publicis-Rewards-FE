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
import type { RewardsBadgeAssignment } from '../../../types/RewardsBadgeAssignment';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../../theme/theme';

type MinimalAssignment = Omit<
  RewardsBadgeAssignment,
  'employeeNumber' | 'fullName' | 'description' | 'quantity'
>;

interface BadgeAssignmentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  assignment: MinimalAssignment;
}

const BadgeAssignmentDetailDialog: React.FC<BadgeAssignmentDetailDialogProps> = ({
  open,
  onClose,
  assignment,
}) => {
  const isSmallScreen = useMediaQuery('(max-width:700px)');

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

       <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h3" fontWeight="bold" fontSize={22}>
              Detalle de Asignación
            </Typography>
            <IconButton onClick={onClose} aria-label="Cerrar">
                <CloseIcon />
            </IconButton>
        </Box>

      <DialogContent dividers>
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          Comentario
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {assignment.comment || 'Sin comentario'}
        </Typography>

        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          Asignado por
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {assignment.assignedBy || 'Desconocido'}
        </Typography>

        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          Fecha
        </Typography>
        <Typography>
          {assignment.assignedAt
            ? new Date(assignment.assignedAt).toLocaleString()
            : 'N/D'}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          fullWidth={isSmallScreen}
          sx={{color: theme.palette.publicisGrey.light}}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BadgeAssignmentDetailDialog;
