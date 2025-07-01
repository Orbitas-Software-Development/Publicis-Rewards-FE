import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
  useTheme,
  Alert,
  CircularProgress,
  IconButton, InputAdornment, 
} from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth'; 
import { loginUser } from '../../services/authService'; 
import type { UserAuthDto } from '../../types/UserAuth';
import { Link as RouterLink } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState<UserAuthDto>({ userName: '', password: '' });
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (field: keyof UserAuthDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!agreePolicy) {
      setError('Debes aceptar la Política del Programa Publicis Rewards.');
      return;
    }

    if (!form.userName || !form.password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(form);

      const { fullName, role, email } = result.userToken.user;
      login(
        result.userToken.token,
        { name: fullName, role, email } 
      );

      setSuccess(result.message);

      navigate('/inicio');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al iniciar sesión');
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
        Iniciar sesión
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Ingresa a tu cuenta para redimir tus huellitas.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
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
            mb: 2,
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
            '& input': {
              color: theme.palette.publicisGrey.light,
            },
            '& label.Mui-focused': {
              color: theme.palette.publicisGrey.main,
            },
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={agreePolicy}
              onChange={(e) => setAgreePolicy(e.target.checked)}
              sx={{
                color: theme.palette.publicisGrey.main,
                '&.Mui-checked': {
                  color: theme.palette.publicisTurquoise.main,
                },
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: theme.palette.publicisGrey.main }}>
              Confirmo que he leído y comprendido la{' '}
              <Link href="#" underline="hover" sx={{ color: theme.palette.publicisTurquoise.main, fontWeight: 500 }}>
                Política del Programa Publicis Rewards
              </Link>
              .
            </Typography>
          }
          sx={{ mb: 2, alignItems: 'flex-start' }}
        />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

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
          {loading ? <CircularProgress size={24} sx={{color: 'white'}} /> : 'Ingresar'}
        </Button>

        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
          <Link  component={RouterLink} to="/forgot-password" underline="hover" sx={{ color: theme.palette.publicisTurquoise.main,  fontWeight: 500, fontSize: 14 }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </Typography>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, fontSize: 16 }}>
          ¿Primera vez?{' '}
          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            sx={{ color: theme.palette.publicisBlue.main, fontWeight: 500, fontSize: 18 }}
          >
            Regístrate aquí
          </Link>

        </Typography>
      </Box>
    </>
  );
}
