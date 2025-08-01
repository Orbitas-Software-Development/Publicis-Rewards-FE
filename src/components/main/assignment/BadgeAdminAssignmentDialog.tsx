import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Avatar,
  Autocomplete,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useUsers } from '../../../hooks/useUser';
import { MdPersonRemove } from 'react-icons/md';
import CustomInput from '../utils/CustomInput';
import theme from '../../../theme/theme';
import CustomDialog from '../utils/CustomDialog';

type Props = {
  open: boolean;
  onClose: () => void;
  onAssign: (data: {
    assignments: { userId: number; quantity: number }[];
  }) => void;
};

type DisplayUser = {
  id: number;
  fullName: string;
  avatarUrl?: string;
  role: string;
};

const BadgeAdminAssignmentDialog: React.FC<Props> = ({ open, onClose, onAssign }) => {
  const [selectedUsers, setSelectedUsers] = useState<DisplayUser[]>([]);
  const [quantity, setQuantity] = useState('');
  const { users, loading, error } = useUsers();

  useEffect(() => {
    if (!open) {
      setSelectedUsers([]);
      setQuantity('');
    }
  }, [open]);

  const handleAssign = () => {
    const amount = parseInt(quantity || '0', 10);
    if (amount <= 0 || selectedUsers.length === 0) return;

    const assignments = selectedUsers.map((user) => ({
      userId: user.id,
      quantity: amount,
    }));

    onAssign({ assignments });
    onClose();
  };

  const handleRemoveUser = (id: number) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title={'Asignar Huellas'}
      actions={
        <Box display="flex" justifyContent="flex-end" gap={1} width="100%">
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssign}
            sx={{color:theme.palette.publicisGrey.light}}
            disabled={
              selectedUsers.length === 0 || !quantity || parseInt(quantity || '0', 10) <= 0
          }
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Asignar Huellas'}
          </Button>
        </Box>
      }
    >

        {loading ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Error al cargar usuarios</Typography>
        ) : (
          <>
            {/* Zona superior: input de búsqueda fijo */}
            <Autocomplete
              options={users as unknown as DisplayUser[]}
              getOptionLabel={(option) => option.fullName}
              sx={{pt:1}}
              onChange={(_, value) => {
                if (value && !selectedUsers.find((u) => u.id === value.id)) {
                  setSelectedUsers((prev) => [...prev, value]);
                }
              }}
              renderInput={(params) => (
              <Box>
                <Typography variant="subtitle2" mb={0.5}>
                  Buscar manager por nombre
                </Typography>
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  size="medium"
                  sx={{
                    backgroundColor: '#f2f1f6',
                    borderRadius: '6px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                    },
                    '& .MuiInputBase-input': {
                      padding: '0.5px !important',
                    },
                  }}
                  // Sin label aquí para que no se sobreponga
                  label={undefined}
                />
              </Box>
              )}

              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  key={option.id}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Avatar src={option.avatarUrl}>{option.fullName[0]}</Avatar>
                  <Box>
                    <Typography fontWeight="medium">{option.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.role}
                    </Typography>
                  </Box>
                </Box>
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />

            {/* Zona central: lista scrollable */}
            {selectedUsers.length > 0 && (
              <>
                <Typography variant="subtitle2">
                    Managers seleccionados
                </Typography>
                <Box
                  sx={{
                    flexGrow: 1, 
                    overflowY: 'auto',
                    pr: 1,
                  }}
                >
                  <Box display="flex" flexDirection="column" gap={1}>
                    {selectedUsers.map((user) => (
                      <Box
                        key={user.id}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          bgcolor: '#f5f5f5',
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar src={user.avatarUrl}>{user.fullName[0]}</Avatar>
                          <Box>
                            <Typography>{user.fullName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.role}
                            </Typography>
                          </Box>
                        </Box>
                        <Tooltip title="Eliminar">
                          <IconButton onClick={() => handleRemoveUser(user.id)}>
                            <MdPersonRemove />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </>
            )}

            {/* Zona inferior: input cantidad fijo */}
            <Box>
              <CustomInput
                label="Cantidad de Huellas"
                name="points"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={!!quantity && parseInt(quantity, 10) <= 0}
                errorMessage="Debe ser mayor a 0"

              />
            </Box>
          </>
        )}
    </CustomDialog>

  );
};

export default BadgeAdminAssignmentDialog;
