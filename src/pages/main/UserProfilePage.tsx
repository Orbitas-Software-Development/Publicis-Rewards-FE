// UserProfile.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Card,
  Divider,
  useTheme,
  useMediaQuery,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import type { UserProfile } from '../../types/UserProfile';
import FullPageLoader from '../../components/main/utils/FullPageLoader';
import ErrorMessage from '../../components/main/utils/ErrorMessage';
import { CalendarMonth, Person, WorkspacePremium } from '@mui/icons-material';
import RedeemIcon from '@mui/icons-material/Redeem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useUsers } from '../../hooks/useUser';
import { API_URL } from '../../utils/ApiLinks';
import AnimatedSnackbar from '../../components/main/utils/AnimatedSnackbar';
import { useAuth } from '../../hooks/useAuth';


const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

const UserProfilePage: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { updateProfilePicture, getUserProfile } = useUsers();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const { user: authUser } = useAuth();
  const isOwner = authUser?.id === user?.id;

  useEffect(() => {
  if (!userId) return;

  setLoading(true);
  getUserProfile(+userId)
    .then(data => {
      setUser(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, [userId, getUserProfile]);


  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };


  const handleClickAvatar = () => {
    if (inputFileRef.current) inputFileRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  const handleSave = async () => {
  if (!selectedFile || !user?.id) return;

  try {
    const { message, path } = await updateProfilePicture(+user.id, selectedFile);

    setUser(prev => prev ? { ...prev, profilePictureUrl: path } : prev);

    handleCancel();
    showSnackbar(message, 'success');
  } catch (err) {
    showSnackbar(
      (err as Error).message ?? 'Error al actualizar la foto de perfil',
      'error'
    );
  }
};


  if (loading) return <FullPageLoader />;

  if (!user) {
    return <ErrorMessage message={' Usuario no encontrado'} />;
  }


  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        height: isDesktop ? '100%' : 'auto',
        gap: 3,
        overflow: isDesktop ? 'hidden' : 'visible',
      }}
    >
      <Box px={2} pt={1}>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="primary.dark"
          textAlign="left"
          sx={{ fontSize: 'clamp(1.7rem, 4vw, 2rem)' }}
        >
          Perfil del Usuario
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mt={0.5}>
          {isOwner
            ? 'Visualiza y administra tu información y logros personales.'
            : 'Visualiza y administra la información y logros asociados a este usuario.'}
        </Typography>
      </Box>

      <Box
        sx={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          mx: 2,
          height: '100%',
          gap: 3,
          pb:2
        }}
      >
        {/* Card superior - Perfil del usuario */}
       <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',border: `1px solid ${theme.palette.publicisGrey.main}` }}>
        <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            alignItems="stretch"
            justifyContent="space-between"
            gap={{ xs: 3, md: 0 }}
        >
            {/* Sección izquierda */}
            <Box
            display="flex"
            alignItems="center"
            gap={3}
            width={{ xs: '100%', md: '48.5%' }}
            pr={{ md: 3 }}
            >
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
          {isOwner && (
            <input
              type="file"
              accept="image/*"
              hidden
              ref={inputFileRef}
              onChange={handleFileChange}
            />
          )}

          <Box
            onClick={isOwner ? handleClickAvatar : undefined}
            sx={{
              width: 108,
              height: 108,
              borderRadius: '50%',
              background: (theme) =>
                `conic-gradient(${theme.palette.publicisBlue.light}, ${theme.palette.publicisOrange.light}, ${theme.palette.publicisBlue.light})`,
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isOwner ? 'pointer' : 'default',
            }}
          >
            <Avatar
              src={preview ?? (user.profilePictureUrl ? `${baseUrl}${user.profilePictureUrl}` : undefined)}
              alt={user.fullName}
              sx={{
                width: 100,
                height: 100,
                fontSize: 36,
              }}
            >
              {!preview && !user.profilePictureUrl && user.fullName.charAt(0)}
            </Avatar>
          </Box>

            {isOwner && (
              <>
                {/* Icono editar o guardar arriba a la derecha */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    borderRadius: '50%',
                    boxShadow: 1,
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (editing) handleSave();
                    else handleClickAvatar();
                  }}
                >
                  <Tooltip title={editing ? 'Guardar imagen' : 'Editar imagen'}>
                    <IconButton size="small" sx={{ p: 0.5 }}>
                      {editing ? (
                        <SaveIcon fontSize="small" color="primary" />
                      ) : (
                        <EditIcon fontSize="small" color="primary" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Icono cancelar abajo a la derecha solo si está editando */}
                {editing && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'background.paper',
                      borderRadius: '50%',
                      boxShadow: 1,
                      zIndex: 10,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel();
                    }}
                  >
                    <Tooltip title="Cancelar cambio">
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <CloseIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </>
            )}

            </Box>    

            <Box display="flex" flexDirection="column" justifyContent="center" gap={0.5}>
                <Typography fontWeight="bold" fontSize={24} lineHeight={1.2}>
                {user.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontSize={16} lineHeight={1.3}>
                {user.email}
                </Typography>
                <Typography
                variant="body1"
                fontWeight="500"
                fontSize={16}
                lineHeight={1.3}
                display="flex"
                alignItems="center"
                gap={0.5}
                >
                <Box component="span">Estado:</Box>
                <Box
                  component="span"
                  color={
                    user.status === 'Activo'
                      ? 'success.main'
                      : user.status === 'Pendiente'
                      ? 'warning.main'
                      : 'error.main'
                  }
                  fontWeight="bold"
                >
                  {user.status}
                </Box>

                </Typography>
            </Box>
            </Box>

            {/* Divider vertical */}
            <Box
            display={{ xs: 'none', md: 'block' }}
            sx={{
                width: '2px',
                backgroundColor: 'divider',
                borderRadius: 30,
                mx: 2,
            }}
            />

            {/* Sección derecha */}
          <Box
            width={{ xs: '100%', md: '51.5%' }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            >
            <Grid container spacing={2}>
                <Grid size={{ xs:12, md:6}}>
                <Typography variant="body1" align="center">
                    <strong>Número de empleado:</strong> {user.employeeNumber}
                </Typography>
                </Grid>
                <Grid size={{ xs:12, md:6}}>
                <Typography variant="body1" align="center">
                    <strong>Fecha de creación:</strong> {new Date(user.createdDate).toLocaleDateString()}
                </Typography>
                </Grid>
                <Grid size={{ xs:12, md:6}}>
                <Typography variant="body1" align="center">
                    <strong>Roles:</strong> {user.roles.join(', ')}
                </Typography>
                </Grid>
                <Grid size={{ xs:12, md:6}}>
                <Typography variant="body1" align="center">
                    <strong>Último inicio de sesión:</strong>{' '}
                      {user.lastLoginDate
                        ? new Date(user.lastLoginDate).toLocaleDateString()
                        : 'Aún sin actividad'}
                </Typography>
                </Grid>
            </Grid>
            </Box>
          </Box>
        </Card>


        {/* Cards inferiores */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Card izquierda - Detalles básicos */}
        <Card
          sx={{
            p: 3,
            flex: 1,
            borderRadius: '16px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
            border: `1px solid ${theme.palette.publicisGrey.main}`,
          }}
        >
          <Typography variant="h6" mb={2} fontWeight="bold">
            📋 Detalles de Colaborador
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box display="flex" alignItems="center" mb={1}>
            <CalendarMonth sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography>
              <strong>Fecha de ingreso:</strong>{' '}
              {new Date(user.hireDate).toLocaleDateString()}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <Person sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography>
              <strong>Puesto:</strong> {user.position}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <Typography sx={{ mr: 1, fontWeight: 'bold', color: 'text.secondary' }}>
              🏢 Departamento:
            </Typography>
            <Typography>{user.department}</Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Typography sx={{ mr: 1, fontWeight: 'bold', color: 'text.secondary' }}>
              👤 Supervisor:
            </Typography>
            <Typography>{user.supervisorName}</Typography>
          </Box>
        </Card>


          {/* Card derecha - Huellas */}
         <Card
          sx={{
            p: 3,
            flex: 1,
            borderRadius: '16px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
            border: `1px solid ${theme.palette.publicisGrey.main}`,
          }}
        >
          <Typography variant="h6" mb={2} fontWeight="bold">
            🐾 Actividad de Recompensas
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box display="flex" alignItems="center" mb={1}>
            <WorkspacePremium sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography>
              <strong>Huellas asignadas:</strong> {user.pointsAssigned}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <RedeemIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography>
              <strong>Huellas canjeadas:</strong> {user.pointsRedeemed}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <CheckCircleIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography>
              <strong>Huellas disponibles:</strong> {user.pointsAvailable}
            </Typography>
          </Box>

          {typeof user.totalRewardsRedeemed === 'number' && (
            <Box display="flex" alignItems="center" mb={1}>
              <RedeemIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography>
                <strong>Total de canjes:</strong> {user.totalRewardsRedeemed}
              </Typography>
            </Box>
          )}
        </Card>

        </Box>
      </Box>
       <AnimatedSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default UserProfilePage;