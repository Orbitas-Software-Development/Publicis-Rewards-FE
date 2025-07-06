import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { resetPassword } from '../../services/authService';

export default function ResetPasswordPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      setError('Por favor completa ambos campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!token || !email) {
      setError('Enlace de recuperación inválido.');
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({ email, token, newPassword });
      setSuccess(response.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error.');
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
        Restablecer contraseña
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: theme.palette.publicisGrey.light }}>
        Ingresa una nueva contraseña y confírmala para completar el proceso de recuperación.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          variant="outlined"
          label="Nueva contraseña"
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          slotProps={{
            inputLabel: {
              sx: {
                fontFamily: 'Gotham Narrow',
                fontWeight: 400,
                color: theme.palette.publicisGrey.dark,
              },
            },
             input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword((prev) => !prev)} edge="end"  sx={{ color: theme.palette.publicisGrey.light }}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                '&::-ms-reveal, &::-ms-clear': {
                  display: 'none',
                },
              },
            },
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: `2px solid`,
                borderImageSlice: 1,
                borderImageSource: `linear-gradient(90deg, ${theme.palette.publicisTurquoise.main}, ${theme.palette.publicisPink.main})`,
              },
              '&:hover fieldset': {
                borderImageSource: `linear-gradient(90deg, ${theme.palette.publicisPink.light}, ${theme.palette.publicisTurquoise.light})`,
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

        <TextField
          fullWidth
          variant="outlined"
          label="Confirmar contraseña"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          slotProps={{
            inputLabel: {
              sx: {
                fontFamily: 'Gotham Narrow',
                fontWeight: 400,
                color: theme.palette.publicisGrey.dark,
              },
            },
              input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end" sx={{ color: theme.palette.publicisGrey.light }}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                '&::-ms-reveal, &::-ms-clear': {
                  display: 'none',
                },
              },
            },
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: `2px solid`,
                borderImageSlice: 1,
                borderImageSource: `linear-gradient(90deg, ${theme.palette.publicisTurquoise.main}, ${theme.palette.publicisPink.main})`,
              },
              '&:hover fieldset': {
                borderImageSource: `linear-gradient(90deg, ${theme.palette.publicisPink.light}, ${theme.palette.publicisTurquoise.light})`,
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
            backgroundImage: `linear-gradient(90deg, ${theme.palette.publicisTurquoise.main}, ${theme.palette.publicisPink.main})`,
            color: theme.palette.publicisGrey.main,
            fontWeight: 600,
            '&:hover': {
              backgroundImage: `linear-gradient(90deg, ${theme.palette.publicisPink.dark}, ${theme.palette.publicisTurquoise.dark})`,
            },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Restablecer contraseña'}
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
            to="/login"
            underline="hover"
            sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="body2" sx={{ fontSize: 16, fontWeight: 500 }}>
              Volver al inicio de sesión
            </Typography>
          </Link>
        </Box>
      </Box>
    </>
  );
}
