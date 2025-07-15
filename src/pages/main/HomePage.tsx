import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { useMediaQuery, useTheme } from '@mui/material';



const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const getDashboardData = (role: string) => {
  switch (role.toLowerCase()) {
    case 'administrador':
      return {
        cards: [
          { label: 'Colaboradores Activos', value: 120, color: 'primary.main', path: '/colaboradores' },
          { label: 'Huellas Asignadas', value: 4520, color: 'error.main', path: '/huellas' },
          { label: 'Canjes Realizados', value: 98, color: 'secondary.main', path: '/canjes' },
          { label: 'Premios Disponibles', value: 34, color: 'success.main', path: '/premios' },
        ],
        pieData: [
          { name: 'Reconocimiento', value: 300 },
          { name: 'Antigüedad', value: 100 },
          { name: 'Programas', value: 50 },
        ],
        barData: [
          { name: 'Ene', canjes: 20 },
          { name: 'Feb', canjes: 30 },
          { name: 'Mar', canjes: 25 },
        ],
      };
    case 'supervisor':
      return {
        cards: [
          { label: 'Miembros del equipo', value: 10, color: 'primary.main', path: '/equipo' },
          { label: 'Huellas disponibles', value: 800, color: 'error.main', path: '/huellas' },
          { label: 'Reconocimientos hechos', value: 15, color: 'secondary.main', path: '/historial' },
          { label: 'Premios canjeados por equipo', value: 8, color: 'success.main', path: '/canjes' },
        ],
        pieData: [
          { name: 'Carlos', value: 5 },
          { name: 'Ana', value: 3 },
          { name: 'Luis', value: 2 },
        ],
        barData: [
          { name: 'Ene', huellas: 100 },
          { name: 'Feb', huellas: 150 },
          { name: 'Mar', huellas: 90 },
        ],
      };
    case 'manager':
      return {
        cards: [
          { label: 'Miembros del equipo', value: 10, color: 'primary.main', path: '/equipo' },
          { label: 'Huellas disponibles', value: 800, color: 'error.main', path: '/huellas' },
          { label: 'Reconocimientos hechos', value: 15, color: 'secondary.main', path: '/historial' },
          { label: 'Premios canjeados por equipo', value: 8, color: 'success.main', path: '/canjes' },
        ],
        pieData: [
          { name: 'Carlos', value: 5 },
          { name: 'Ana', value: 3 },
          { name: 'Luis', value: 2 },
        ],
        barData: [
          { name: 'Ene', huellas: 100 },
          { name: 'Feb', huellas: 150 },
          { name: 'Mar', huellas: 90 },
        ],
    };
    case 'colaborador':
      return {
        cards: [
          { label: 'Huellas Disponibles', value: 320, color: 'primary.main', path: '/huellas' },
          { label: 'Huellas Canjeadas', value: 180, color: 'error.main', path: '/historial' },
          { label: 'Canjes Realizados', value: 3, color: 'secondary.main', path: '/canjes' },
          { label: 'Premios Favoritos', value: 2, color: 'success.main', path: '/catalogo' },
        ],
        pieData: [
          { name: 'Gift Card', value: 1 },
          { name: 'Camiseta', value: 1 },
          { name: 'Taza', value: 1 },
        ],
        barData: [
          { name: '2023', huellas: 180 },
          { name: '2024', huellas: 320 },
        ],
      };
    default:
      return { cards: [], pieData: [], barData: [] };
  }
};

export default function HomePage() {
  const { user } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (!user) {
    return (
      <Typography textAlign="center" mt={10}>
        Cargando...
      </Typography>
    );
  }

  const role = user.activeRole.name?.toLowerCase() || 'colaborador';
  const { cards, pieData, barData } = getDashboardData(role);

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p:{xs:2, md:3},
      display: 'flex', 
      flexDirection: 'column', 
      height: isDesktop ? '100%' : 'auto',
      gap: 3,
      overflow: isDesktop ? 'hidden' : 'visible'
    }}>

      {/* Título (20%) */}
      <Box
        sx={{
          flexGrow: isDesktop ? 1 : undefined,
          px: 2,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          color="primary.dark"
          textAlign="center"
          sx={{ width: '100%', fontSize: 'clamp(1.7rem, 4vw, 2.2rem)', }}
        >
          👋 ¡Te damos la bienvenida a Publicis Rewards! 🐾
        </Typography>
      </Box>

      {/* Tarjetas */}
      <Box
        sx={{
          flexGrow: isDesktop ? 1 : undefined,
          flexBasis: isDesktop ? '25%' : undefined,
          px: 2,
        }}
      >

        <Grid container spacing={3} sx={{  height: isDesktop ? '100%' : 'auto', }}>
          {cards.map(({ label, value, color, path }) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={label}>
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: isDesktop ? '100%' : 130,
                  borderTop: `5px solid`,
                  borderColor: color,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)',
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                }}
              >
                 <CardActionArea
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      textAlign: 'center',
                      '&:hover': {
                        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
                        transition: 'box-shadow 0.3s ease-in-out',
                      },
                    }}
                    onClick={() => {
                      window.location.href = path;
                    }}
                  >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontSize: {
                          xs: '1.8rem',
                          sm: '1.6rem',
                          md: '1.8rem',
                          lg: '2rem',
                        },
                      }}
                    >
                      {value}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '1.1rem',
                      }}
                    >
                      {label}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>

            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Gráficos */}
      <Box
        sx={{
          flexGrow: isDesktop ? 2 : undefined,
          flexBasis: isDesktop ? '55%' : undefined,
          px: 2,
          overflow: isDesktop ? 'hidden' : 'visible',
          mb: isDesktop ? 0 : 4,
        }}
      >

        <Grid container spacing={3} sx={{  height: isDesktop ? '98%' : 'auto' }}>
          <Grid size={{ xs: 12, md: 6 }} sx={{  height: isDesktop ? '100%' : 'auto' }}>
            <Card sx={{  height: isDesktop ? '100%' : 'auto', display: 'flex', flexDirection: 'column',  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',borderRadius: 3,border: '1px solid rgba(0, 0, 0, 0.1)'}}>
              <CardContent sx={{ textAlign: 'center', flexShrink: 0 }}>
                <Typography variant="h6" gutterBottom>
                  Distribución de Huellas
                </Typography>
              </CardContent>
              <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height={isDesktop ? '100%' : 300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: isDesktop ? '100%' : 'auto', display: 'flex', flexDirection: 'column', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',borderRadius: 3,border: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ textAlign: 'center', flexShrink: 0 }}>
                <Typography variant="h6" gutterBottom>
                  Canjes / Huellas por Mes o Año
                </Typography>
              </CardContent>
              <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height={isDesktop ? '98%' : 300}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey={'canjes' in barData[0] ? 'canjes' : 'huellas'}
                      fill="#8884d8"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
