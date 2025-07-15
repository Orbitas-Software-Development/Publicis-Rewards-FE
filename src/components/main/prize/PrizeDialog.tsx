import React, { useState, useEffect } from 'react';
import { Button, Box, CircularProgress, Avatar, Typography, Dialog, IconButton, DialogContent } from '@mui/material';
import type { RewardsPrize } from '../../../types/RewardsPrize';
import CustomDialog from '../../main/utils/CustomDialog';
import CustomInput from '../../main/utils/CustomInput';
import theme from '../../../theme/theme';
import CloseIcon from '@mui/icons-material/Close';

type FormData = Omit<RewardsPrize, 'id' | 'createdAt' | 'imageUrl'> & {
  imageFile?: File | null;
  imagePreview?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (file: File | null) => void;
  onSave: () => Promise<void>;
  formData: FormData;
  isEditing: boolean;
};

const PrizeDialog: React.FC<Props> = ({
  open,
  onClose,
  onChange,
  onImageChange,
  onSave,
  formData,
  isEditing,
}) => {
  const [errors, setErrors] = useState({
    code: false,
    description: false,
    cost: false,
    stock: false,
  });
  const [loading, setLoading] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({ code: false, description: false, cost: false, stock: false });
      setLoading(false);
    }
  }, [open]);

  const validateAndSave = async () => {
    const hasErrors = {
      code: formData.code.trim() === '',
      description: formData.description.trim() === '',
      cost: formData.cost <= 0,
      stock: formData.stock < 0,
    };
    setErrors(hasErrors);

    if (Object.values(hasErrors).some(Boolean)) return;

    setLoading(true);
    try {
      await onSave();
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onImageChange(file);
    }
  };

  const handleOpenImageDialog = () => {
    if (formData.imagePreview) {
      setImageDialogOpen(true);
    }
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
  };


  return (
    <>
    <CustomDialog
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Premio' : 'Añadir Premio'}
      actions={
        <Box display="flex" justifyContent="flex-end" gap={1} width="100%">
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={validateAndSave}
            disabled={loading}
            sx={{ width: {xs: '40%', sm:'30%', md:'25%', xl: '25%'}, color: theme.palette.publicisGrey.light }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar'}
          </Button>
        </Box>
      }
    >
      <CustomInput
        label="Código"
        name="code"
        value={formData.code}
        onChange={onChange}
        error={errors.code}
        errorMessage="El código es obligatorio"
      />

      <CustomInput
        label="Descripción"
        name="description"
        value={formData.description}
        onChange={onChange}
        error={errors.description}
        errorMessage="La descripción es obligatoria"
      />

        <Box>
          <Typography variant="subtitle2" mb={1}>
            Imagen
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Box
              onClick={handleOpenImageDialog}
              sx={{ cursor: formData.imagePreview ? 'pointer' : 'default' }}
            >
              <Avatar
                variant="rounded"
                src={formData.imagePreview || ''}
                sx={{ width: 70, height: 70, backgroundColor: theme.palette.publicisGrey.dark }}
              />
            </Box>
            <Button variant="outlined" component="label">
              Subir Imagen
              <input hidden accept="image/*" type="file" onChange={handleFileInput} />
            </Button>
          </Box>
        </Box>

      <CustomInput
        label="Costo"
        type="number"
        name="cost"
        value={formData.cost}
        onChange={onChange}
        error={errors.cost}
        errorMessage="Debe ser mayor a 0"
      />

      <CustomInput
        label="Stock"
        type="number"
        name="stock"
        value={formData.stock}
        onChange={onChange}
        error={errors.stock}
        errorMessage="Debe ser 0 o mayor"
      />
    </CustomDialog>
      <Dialog open={imageDialogOpen} onClose={handleCloseImageDialog} maxWidth="lg">
        <DialogContent sx={{ position: 'relative', p: 0 }}>
          <IconButton
            aria-label="cerrar"
            onClick={handleCloseImageDialog}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={formData.imagePreview}
            alt="Imagen ampliada"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              display: 'block',
              margin: 'auto',
              borderRadius: 1,
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrizeDialog;
