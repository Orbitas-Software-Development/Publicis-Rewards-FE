import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import CustomDialog from '../../main/utils/CustomDialog';
import CustomInput from '../../main/utils/CustomInput';
import theme from '../../../theme/theme';
import type { RewardsBadgeSubcategory } from '../../../types/RewardsBadgeSubcategory';

type FormData = Omit<RewardsBadgeSubcategory, 'minYears' | 'maxYears' >;

type Props = {
  open: boolean;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => Promise<void>;
  formData: FormData;
};

const BadgeSubcategoryDialog: React.FC<Props> = ({
  open,
  onClose,
  onChange,
  onSave,
  formData
}) => {
  const [errors, setErrors] = useState({
    points: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({ points: false });
      setLoading(false);
    }
  }, [open]);

  const validateAndSave = async () => {
    const hasErrors = {
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
      title={'Editar Subcategoría'}
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
            sx={{ width: { xs: '40%', sm: '30%', md: '20%' }, color: theme.palette.publicisGrey.light }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar'}
          </Button>
        </Box>
      }
    >

      <CustomInput
        label="ID"
        name="id"
        value={formData.id}
        onChange={onChange}
        readOnly={true}
      />

      <CustomInput
        label="Descripción"
        name="description"
        value={formData.description ?? ''}
        onChange={onChange}
        readOnly={true}
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

export default BadgeSubcategoryDialog;
