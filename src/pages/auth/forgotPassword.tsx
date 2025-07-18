import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  Link
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { sendPasswordResetLink } from '../../services/authService';


export default function ForgotPasswordPage() {
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  if (!email) {
    setError('Por favor ingresa tu correo electrónico.');
    return;
  }

  // Validar email simple
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError('Por favor ingresa un correo válido.');
    return;
  }

  setLoading(true);

  try {
    const response = await sendPasswordResetLink(email);
    setSuccess(response.message);
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Error al enviar el enlace de recuperación');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: theme.palette.publicisTurquoise.main,
          fontSize: {
            xs: '1.6rem',
            sm: '1.8rem',
            md: '2rem',
          },
        }}
      >
        Recuperar contraseña
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: theme.palette.publicisGrey.light }}>
        Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>

      <TextField
        fullWidth
        variant="outlined"
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        slotProps={{
          inputLabel: {
            sx: {
              fontFamily: 'Gotham Narrow',
              fontWeight: 400,
              color: theme.palette.publicisGrey.dark,
            },
          },
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: `2px solid`,
              borderImageSlice: 1,
              borderImageSource: `linear-gradient(90deg, ${theme.palette.publicisTurquoise.main}, ${theme.palette.publicisOrange.main})`,
            },
            '&:hover fieldset': {
              borderImageSource: `linear-gradient(90deg, ${theme.palette.publicisOrange.light}, ${theme.palette.publicisTurquoise.light})`,
            },
            '&.Mui-focused fieldset': {
              border: '2px solid',
              borderColor: theme.palette.publicisTurquoise.main,
              borderImage: 'none',
            },
          },
          '& input': {
            color: theme.palette.publicisGrey.light,
          },
          '& label.Mui-focused': {
            color: theme.palette.publicisGrey.main,
          },
        }}
      />

      {error && (
            <Alert severity="error" sx={{ mb: 2, color:theme.palette.publicisGrey.main }}>
              {error}
            </Alert>
          )}
      {success && <Alert severity="success" sx={{ mb: 2, color:theme.palette.publicisGrey.main}}>{success}</Alert>}

      <Button
        type="submit"
        fullWidth
        disabled={loading}
        sx={{
          py: 1.2,
          backgroundImage: `linear-gradient(90deg, ${theme.palette.publicisTurquoise.main}, ${theme.palette.publicisOrange.main})`,
          color: theme.palette.publicisGrey.main,
          fontWeight: 600,
          '&:hover': {
            backgroundImage: `linear-gradient(90deg, ${theme.palette.publicisOrange.dark}, ${theme.palette.publicisTurquoise.dark})`,
          },
        }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Enviar enlace'}
      </Button>
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: theme.palette.publicisBlue.main,
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
          <Link
            component={RouterLink}
            to="/iniciar-sesion"
            underline="hover"
            sx={{ ml: 0.5,display: 'flex', alignItems: 'center' }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: 16,
                fontWeight: 500
              }}
            >
              Volver al inicio de sesión
            </Typography>
          </Link>
        </Box>

      </Box>
    </>
  );
}
