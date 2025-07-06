import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  useTheme,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import { registerUser } from '../../services/authService';
import type { UserAuthDto } from '../../types/UserAuth';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function RegisterPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState<UserAuthDto>({ userName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const handleChange = (field: keyof UserAuthDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.userName || !form.password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    const password = form.password;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,})/;

    if (!passwordRegex.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter especial.');
      return;
    }


    setLoading(true);
    try {
      const result = await registerUser(form);
      setSuccess(result.message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error al registrar.');
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
        Registro de Usuario
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Crea tu cuenta para comenzar a redimir tus huellitas.
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          label="Usuario"
          value={form.userName}
          onChange={handleChange('userName')}
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
            '& input': { color: theme.palette.publicisGrey.light },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: '2px solid',
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
            '& label.Mui-focused': {
              color: theme.palette.publicisGrey.main,
            },
          }}
        />

        <TextField
          fullWidth
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          label="Contraseña"
          value={form.password}
          onChange={handleChange('password')}
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
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    sx={{ color: theme.palette.publicisGrey.light }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                // Remueve íconos automáticos del navegador como el ojo de Edge
                '&::-ms-reveal, &::-ms-clear': {
                  display: 'none',
                },
              },
            },
          }}
          sx={{
            mb: 3,
            '& input': { color: theme.palette.publicisGrey.light },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: '2px solid',
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
           {loading ? <CircularProgress size={24} sx={{color:'white'}}/> : 'Registrarse'}
        </Button>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3,fontSize: 16 }}>
          ¿Ya tienes cuenta?{' '}
        <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{ color: theme.palette.publicisBlue.main, fontWeight: 500, fontSize: 18 }}
          >
            Inicia sesión
          </Link>
        </Typography>
      </Box>
    </>
  );
}
