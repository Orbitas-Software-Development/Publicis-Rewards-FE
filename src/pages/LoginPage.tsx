import { Button, TextField, Container, Typography, Box, Link } from '@mui/material';

export default function LoginPage() {
  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Box
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'publicisGrey.light',
        }}
      >
        {/* Título principal */}
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            textAlign: 'center',
            color: 'publicisBlue.main',
           
          }}
        >
          Iniciar Sesión
        </Typography>

        {/* Subtítulo descriptivo */}
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            textAlign: 'center',
            fontWeight: 300,
            color: 'publicisBlack.main',
            mb: 2,
          }}
        >
          Accede a tu cuenta para ver y redimir tus recompensas.
        </Typography>

        {/* Campo correo */}
        <TextField
          fullWidth
          label="Correo electrónico"
          variant="outlined"
          margin="normal"
          slotProps={{
            inputLabel: {
            sx: {
                fontFamily: 'Gotham Narrow',
                fontWeight: 400,
            },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontWeight: 300,
              '& fieldset': {
                borderColor: 'publicisBlue.main',
              },
              '&:hover fieldset': {
                borderColor: 'publicisBlue.dark',
              },
            },
          }}
        />

        {/* Campo contraseña */}
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          variant="outlined"
          margin="normal"
          slotProps={{
            inputLabel: {
            sx: {
                fontFamily: 'Gotham Narrow',
                fontWeight: 400,
            },
            },
        }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'publicisBlue.main',
              },
              '&:hover fieldset': {
                borderColor: 'publicisBlue.dark',
              },
            },
          }}
        />

        {/* Botón de ingresar */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.5,
            backgroundColor: 'publicisBlue.main',
            '&:hover': {
              backgroundColor: 'publicisBlue.dark',
            },
          }}
        >
          Ingresar
        </Button>

        {/* Botón de registrarse */}
        <Button
          fullWidth
          variant="outlined"
          sx={{
            mt: 2,
            py: 1.5,
            color: 'publicisGold.main',
            borderColor: 'publicisGold.main',
            '&:hover': {
              color: 'publicisGold.dark',
              borderColor: 'publicisGold.dark',
            },
          }}
        >
          Registrarse
        </Button>

        {/* Enlace recuperar contraseña */}
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textAlign: 'center',
          }}
        >
          <Link
            href="#"
            underline="hover"
            sx={{
              color: 'publicisTurquoise.main',
              '&:hover': {
                color: 'publicisTurquoise.dark',
              },
               fontSize: '16px'
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography
          variant="caption"
          sx={{
            color: 'publicisPink.main',
            fontSize: '14px'
          }}
        >
          © 2025 Publicis. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  );
}
