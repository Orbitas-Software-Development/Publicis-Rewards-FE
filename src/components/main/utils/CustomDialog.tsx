// CustomDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../../theme/theme';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

const CustomDialog: React.FC<Props> = ({ open, onClose, title, children, actions }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '95%', sm: '80%', md: '40%', lg:'35%', xl: '30%' },
            maxWidth: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 64px)',
          },
        },
         backdrop: {
            sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
        },
      }}
    >
      <Box
        sx={{
          pt: 3,
          pb: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ px: 3 }}>
          <DialogTitle sx={{ p: 0, mb: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h3" fontWeight="bold" fontSize={22}>
                {title}
              </Typography>
              <IconButton onClick={onClose} aria-label="Cerrar">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <Divider sx={{ my: 2 }} />
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: 'overlay',
            '@supports (-moz-appearance: none)': {
              overflow: 'auto',
            },
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'transparent',
              borderRadius: '3px',
            },
            '&:hover::-webkit-scrollbar-thumb, &:focus-within::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.publicisGrey.dark,
            },
          }}
        >
          <Box
            sx={{
              px: 3,
              width: 'calc(100% - 6px)',
              paddingRight: 'calc(24px - 6px)',
            }}
          >
            <DialogContent
              sx={{
                p: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                '& > div': { mb: 1.5 },
              }}
            >
              {children}
            </DialogContent>
          </Box>
        </Box>

        {actions && (
          <Box sx={{ px: 3 }}>
            <DialogActions sx={{ p: 0, mt: 3 }}>{actions}</DialogActions>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default CustomDialog;
