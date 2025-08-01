import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  CircularProgress,
  Switch,
  Typography,
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
  dialogMode: 'add' | 'edit';
};

const BadgeCategoryDialog: React.FC<Props> = ({
  open,
  onClose,
  onChange,
  onSave,
  formData,
  dialogMode
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
      title={dialogMode === 'edit' ? 'Editar Categoría' : 'Añadir Categoría'}
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
        label="Código"
        name="code"
        value={formData.code}
        onChange={onChange}
        error={errors.code}
        errorMessage="El código es obligatorio"
        readOnly={dialogMode === 'edit' && formData.isAutomatic}
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

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        py={0.5}
        px={2}
        border="1px solid"
        borderColor= {theme.palette.publicisGrey.dark}
        borderRadius={2}
        sx={{backgroundColor: '#f2f1f6'}}
      >
        <Typography variant="subtitle2">
          Asignación automática
        </Typography>
        <Switch
          checked={formData.isAutomatic}
          onChange={(e) =>
            onChange({
              target: {
                name: 'isAutomatic',
                value: e.target.checked,
              },
            } as unknown as React.ChangeEvent<HTMLInputElement>)
          }
           sx={{
            '& .MuiSwitch-thumb': {
              backgroundColor: 'white',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: formData.isAutomatic ? 'success.main' : 'error.main',
              opacity: 1
            },
            '& .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: 'grey',
            },
          }}
        />

      </Box>


    </CustomDialog>
  );
};

export default BadgeCategoryDialog;
