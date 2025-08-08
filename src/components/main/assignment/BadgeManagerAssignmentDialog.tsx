import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Divider,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { MdPersonRemove } from 'react-icons/md';
import { useUsers } from '../../../hooks/useUser';
import huella from '../../../assets/images/huella.png';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../../theme/theme';
import { useBadgeCategories } from '../../../hooks/useBadgeCategory';
import { useAuth } from '../../../hooks/useAuth';


type Props = {
  open: boolean;
  onClose: () => void;
  onAssign: (data: { assignments: { userId: number; categoryId: number; points: number, comment: string }[] }) => void;
  assigning: boolean;
};

type DisplayUser = {
  id: number;
  fullName: string;
  avatarUrl?: string;
  role: string;
};

type SelectedUser = DisplayUser & { categoryId: number | null; comment: string };

const BadgeManagerAssignmentDialog: React.FC<Props> = ({ open, onClose, onAssign, assigning }) => {
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [globalCategoryId, setGlobalCategoryId] = useState<number | null>(null); 
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [loadingPoints, setLoadingPoints] = useState(false);

  const { user} = useAuth();
  const { users, getManagerAvailablePoints} = useUsers();
  const { categories } = useBadgeCategories();

  const nonAutomaticCategories = categories.filter((cat) => !cat.isAutomatic);


  const isSmallScreen = useMediaQuery('(max-width:699px)');


  useEffect(() => {
    if (open && user?.id) {
      setLoadingPoints(true);
      getManagerAvailablePoints(user.id)
        .then(points => setAvailablePoints(points ?? 0))
        .catch(() => setAvailablePoints(0))
        .finally(() => setLoadingPoints(false));
    } else if (!open) {
      setSelectedUsers([]);
      setGlobalCategoryId(null);
      setAvailablePoints(0);
      setLoadingPoints(false);
    }
  }, [open, user, getManagerAvailablePoints]);



  const handleAssign = () => {
    const assignments = selectedUsers
      .filter((user) => user.categoryId !== null && user.comment.trim())
      .map((user) => {
        const category = nonAutomaticCategories.find((cat) => cat.id === user.categoryId);
        return {
          userId: user.id,
          categoryId: user.categoryId!,
          points: category?.points ?? 0,
          comment: user.comment.trim(),
        };
      });

    if (assignments.length > 0) {
      onAssign({ assignments });
    }
  };



  const handleRemoveUser = (id: number) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleCategoryChange = (id: number, value: number) => {
    setSelectedUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, categoryId: value } : u))
    );
  };

  const handleGlobalCategoryChange = (value: number) => {
    setGlobalCategoryId(value);
    setSelectedUsers((prev) =>
      prev.map((u) => ({ ...u, categoryId: value }))
    );
  };

  const handleCommentChange = (id: number, value: string) => {
    setSelectedUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, comment: value } : u))
    );
  };

  const totalAssigned = selectedUsers.reduce((acc, u) => {
    const category = nonAutomaticCategories.find((c) => c.id === u.categoryId);
    return acc + (category?.points || 0);
  }, 0);

  const remainingPoints = availablePoints - totalAssigned;

  const hasError = remainingPoints < 0 || selectedUsers.some((u) => u.categoryId === null || !u.comment.trim());


   return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 64px)',
            width: {
              xs: '95vw',
              sm: '90vw',
              md: '70vw',
              lg: '65vw',
              xl: '50vw' 
            },
            m: {
              xs: 0,  
              sm: 'auto',  
            },
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
        {/* Título + Contador */}
        <Box sx={{ px: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h3" fontWeight="bold" fontSize={22}>
              Asignar Huellas
            </Typography>

            {/* Contador */}
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={huella} alt="huellita" sx={{ width: {xs:40, md:50},  height: {xs:40, md:50} }} />
              <Box textAlign="left" sx={{mr:{xs:1, md: 4}}}>
                <Typography variant="body2" fontSize={16} mt={0} color="text.secondary">
                  Huellas disponibles
                </Typography>
                {loadingPoints ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    fontSize={22}
                    color={remainingPoints < 0 ? 'error' : 'primary'}
                  >
                    {remainingPoints}
                  </Typography>
                )}
              </Box>
              <IconButton onClick={onClose} aria-label="Cerrar">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Divider sx={{ mt: 2, mb: selectedUsers.length > 1 ? 0 : 2 }} />
        </Box>

        {/* Contenido */}
        <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            display="flex"
            gap={isSmallScreen ? 1 : 4}
            flexDirection={isSmallScreen ? 'column' : 'row'}
          >
            {/* Izquierda - Selector de colaboradores */}
            <Box display="flex" flex={1} flexDirection="column" gap={1}>
              <Typography variant="subtitle2">Busca y selecciona colaboradores</Typography>
              <Autocomplete
                options={users as unknown as DisplayUser[]}
                getOptionLabel={(option) => option.fullName}
                onChange={(_, value) => {
                  if (value && !selectedUsers.find((u) => u.id === value.id)) {
                    setSelectedUsers((prev) => [
                      ...prev,
                      { ...value, categoryId: globalCategoryId, comment: '' }, 
                    ]);
                  }
                }}
                renderInput={(params) => (
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
                        padding: '2px !important',
                      },
                    }}
                  />
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
            </Box>

            {/* Derecha - Selector de categoría global */}
            <Box
              display="flex"
              flex={1}
              flexDirection="column"
              gap={1}
              sx={{ mt: isSmallScreen ? 2 : 0 }}
            >
              <Typography variant="subtitle2">
                Selecciona una categoría en común
              </Typography>
              <TextField
                select
                size="medium"
                value={globalCategoryId ?? ''}
                onChange={(e) => handleGlobalCategoryChange(parseInt(e.target.value))}
                sx={{
                  backgroundColor: '#f2f1f6',
                  borderRadius: '6px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                  },
                  '& .MuiInputBase-input': {
                    padding: '11px !important',
                  },
                }}
                disabled={selectedUsers.length === 0}
              >
                <MenuItem value="" disabled>
                  Seleccionar categoría para todos
                </MenuItem>
                {nonAutomaticCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.description} ({cat.points} huellas)
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* Abajo - Lista completa ocupando 100% */}
          {selectedUsers.length > 0 && (
            <Box>
              <Typography variant="subtitle2" mt={1} mb={1}>
                Colaboradores seleccionados
              </Typography>

              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                maxHeight={200}
                overflow="auto"
              >
                {selectedUsers.map((user) => (
                 <Box
                    key={user.id}
                    display="flex"
                    flexDirection={isSmallScreen ? 'column' : 'row'}
                    alignItems={isSmallScreen ? 'flex-start' : 'center'}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      bgcolor: '#f9f9f9',
                      gap: 2,
                      position: 'relative',
                    }}
                  >

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      flexBasis: isSmallScreen ? '100%' : '30%',
                      flexGrow: 0,
                      gap: 2,
                    }}
                  >
                    {/* Avatar + Nombre, con flexGrow=1 para ocupar todo el espacio y empujar botón */}
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      sx={{ 
                        flexGrow: 1, 
                        minWidth: 0  
                      }}
                    >
                      <Avatar src={user.avatarUrl}>{user.fullName[0]}</Avatar>
                      <Box>
                        <Typography fontWeight="medium" sx={{ wordBreak: 'break-word' }}>
                          {user.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.role}
                        </Typography>
                      </Box>
                    </Box>

                    {/* IconButton visible solo en pantallas pequeñas */}
                    {isSmallScreen && (
                      <Tooltip title="Eliminar">
                        <IconButton onClick={() => handleRemoveUser(user.id)} size="small">
                          <MdPersonRemove />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                    {/* Comentario */}
                    <TextField
                      label="Comentario"
                      size="small"
                      value={user.comment}
                      onChange={(e) => handleCommentChange(user.id, e.target.value)}
                      error={!user.comment.trim()}
                      fullWidth={isSmallScreen}
                      sx={{
                        flexBasis: isSmallScreen ? '100%' : '35%',
                        flexGrow: 0,
                        minWidth: 150,
                      }}
                    />

                    {/* Categoría */}
                    <TextField
                      select
                      label="Categoría"
                      size="small"
                      value={user.categoryId ?? ''}
                      onChange={(e) => handleCategoryChange(user.id, parseInt(e.target.value))}
                      error={user.categoryId === null}
                      fullWidth={isSmallScreen}
                      sx={{
                        flexBasis: isSmallScreen ? '100%' : '35%',
                        flexGrow: 0,
                        minWidth: 120,
                      }}
                    >
                      <MenuItem value="" disabled>
                        Seleccionar categoría
                      </MenuItem>
                      {nonAutomaticCategories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.description} ({cat.points} huellas)
                        </MenuItem>
                      ))}
                    </TextField>

                    {/* IconButton en pantalla grande */}
                    {!isSmallScreen && (
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{
                          flexBasis: '5%',
                        }}
                      >
                        <Tooltip title="Eliminar">
                          <IconButton onClick={() => handleRemoveUser(user.id)} size="medium">
                            <MdPersonRemove />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>

                ))}
              </Box>
            </Box>
          )}


        </DialogContent>

        {/* Acciones */}
        <DialogActions sx={{ justifyContent: 'flex-end', px: 3 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedUsers.length === 0 || hasError}
            sx={{width: { xs: '40%', sm: '30%', md: '25%', lg: '20%' }, color: theme.palette.publicisGrey.light }}
            onClick={handleAssign}
          >
            {assigning ? <CircularProgress size={24} color="inherit" /> : 'Asignar Huellas'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};


export default BadgeManagerAssignmentDialog;
