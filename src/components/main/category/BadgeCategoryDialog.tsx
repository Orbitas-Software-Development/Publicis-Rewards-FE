import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import type { RewardsBadgeCategory } from '../../../types/RewardsBadgeCategory';
import CustomDialog from '../../main/utils/CustomDialog';
import CustomInput from '../../main/utils/CustomInput';
import theme from '../../../theme/theme';

type FormData = Omit<RewardsBadgeCategory, 'id' | 'createdAt'>;

type Props = {
  open: boolean;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => Promise<void>;
  formData: FormData;
  isEditing: boolean;
};

const BadgeCategoryDialog: React.FC<Props> = ({
  open,
  onClose,
  onChange,
  onSave,
  formData,
  isEditing,
}) => {
  const [errors, setErrors] = useState({
    code: false,
    description: false,
    points: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({ code: false, description: false, points: false });
      setLoading(false);
    }
  }, [open]);

  const validateAndSave = async () => {
    const hasErrors = {
      code: formData.code.trim() === '',
      description: formData.description.trim() === '',
      points: formData.points <= 0,
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

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Categoría' : 'Añadir Categoría'}
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
            sx={{ width: {xs: '40%', sm:'30%', md:'30%', xl: '25%'}, color: theme.palette.publicisGrey.light }}
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

      <CustomInput
        label="Cantidad de Huellas"
        name="points"
        type="number"
        value={formData.points}
        onChange={onChange}
        error={errors.points}
        errorMessage="Debe ser mayor a 0"
      />
    </CustomDialog>
  );
};

export default BadgeCategoryDialog;
