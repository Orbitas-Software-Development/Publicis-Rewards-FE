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
  LineChart,
  Line,
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { useMediaQuery, useTheme } from '@mui/material';
import { useDashboard } from '../../hooks/useDashboard';
import ErrorMessage from '../../components/main/utils/ErrorMessage';
import FullPageLoader from '../../components/main/utils/FullPageLoader';
import { mapDashboardData } from '../../utils/dashboardDataMapper';
import { DashboardChartCard } from '../../components/main/dashboard/DashboardChartCard';


const COLORS = ['#16ABE0', '#22C55E', '#FC8B3C', '#CC0028'];

export default function HomePage() {
  const { user } = useAuth();
  const { data, loading, error } = useDashboard();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (loading) return <FullPageLoader />;
  if (error) return <ErrorMessage message={error} />;
  if (!user || !data)
    return (
      <Typography textAlign="center" mt={10}>
        Cargando...
      </Typography>
    );

  const role = user.activeRole.name?.toLowerCase() || 'colaborador';
  const { cards, pieDataAdmin, pieDataManager, pieDataCollaborator, barDataPeopleByArea, barDataPointsByArea, barDataPointsByYear,
     barDataRedemptionsByMonth, barDataSummary, barDataTopPrizes, barDataMonthlyRedemptionsByTeam } = mapDashboardData(role, data);



 return (
    <Box sx={{ 
      flexGrow: 1, 
      p:{xs:2, md:3},
      display: 'flex', 
      flexDirection: 'column', 
      height:  'auto',
      gap: 3,
      overflowY: isDesktop
      ? role !== 'colaborador'
        ? 'visible'  
        : 'hidden'    
      : 'visible',
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
          flexBasis: isDesktop ? (role !== 'colaborador' ? '17%' : '25%') : undefined,
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
          flexGrow: isDesktop ? (role !== 'colaborador' ? undefined : 2) : undefined,
          flexBasis: isDesktop ? (role !== 'colaborador' ? undefined : '55%') : undefined,
          px: 2,
          overflow: isDesktop ? 'hidden' : 'visible',
          mb: isDesktop ? 0 : 2,
          pb: isDesktop ?  (role !== 'colaborador' ? 9  : 1) : 0
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{ height: role !== 'colaborador' && isDesktop ? 'auto' : isDesktop ? '98%' : 'auto' }}
        >
          {role === 'administrador' && (
            <>
              {/* Gráfico 1 - Pie */}
              <Grid size={{ xs: 12, md: 6 }}>
                <DashboardChartCard
                 title="% de huellas disponibles por rango para canjear"
                  empty={pieDataAdmin.length === 0}
                >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 10, right: 0, left: 0, bottom: 30 }}>
                        <Pie
                          data={pieDataAdmin}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          label={({ name, percent }) => {
                            if (!percent) return `${name}: 0%`;
                            const formatted = (percent * 100).toFixed(2);
                            const trimmed = formatted.replace(/\.?0+$/, '');
                            return `${name}: ${trimmed}%`;
                          }}

                        >
                          {pieDataAdmin.map((_entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) =>{
                            const percent = value ?? 0;
                            const formattedValue = percent.toFixed(2).replace(/\.?0+$/, '');

                            return [`${formattedValue}% de colaboradores en este rango`, name]
                          }}
                          separator=" - "
                        />
                      </PieChart>
                    </ResponsiveContainer>
                </DashboardChartCard>              
              </Grid>

              {/* Gráfico 2 - Bar (Canjes por mes) */}
              <Grid size={{ xs: 12, md: 6 }}>
                  <DashboardChartCard
                    title="Canjes por Mes"
                    empty={barDataRedemptionsByMonth.length === 0}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={barDataRedemptionsByMonth} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                        <XAxis
                          dataKey="name"
                          tickFormatter={(month) => month.substring(0, 3)} 
                        />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="canjes"
                          stroke={theme.palette.publicisPurple.main}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                  </ResponsiveContainer>
                </DashboardChartCard> 
              </Grid>

              {/* Gráfico 3 - Bar (Frecuencia por categoría) */}
              <Grid size={{ xs: 12, md: 6 }}>
                  <DashboardChartCard
                    title="Top 5 Premios Más Canjeados"
                    empty={barDataTopPrizes.length === 0}
                  >         
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={barDataTopPrizes}
                      margin={{ top: 0, right: 30, bottom: 10, left: 40 }}
                    >
                      <XAxis type="number" />
                      <YAxis dataKey="code" type="category" />
                      <Tooltip
                        labelFormatter={(code) => `Código: ${code}`}
                        formatter={(value, _name, props) => {
                          const { payload } = props;
                          return [
                            `Canjes: ${value}`,
                            `Descripción: ${payload.name}`,
                          ];
                        }}
                      />
                      <Bar dataKey="count" fill={theme.palette.publicisTurquoise.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </DashboardChartCard>  
              </Grid>

              {/* Gráfico 4 - Bar (Asignadas vs Canjeadas) */}
              <Grid size={{ xs: 12, md: 6 }}>
                  <DashboardChartCard
                    title="Huellas Asignadas vs Canjeadas"
                    empty={barDataSummary.length === 0}
                  >               
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barDataSummary} margin={{ top: 0, right: 20, left: 10, bottom: 10 }}>
                        <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Asignadas" fill={theme.palette.publicisPurple.main} />
                      <Bar dataKey="Canjeadas" fill={theme.palette.publicisOrange.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </DashboardChartCard>  
              </Grid>
            </>
            )}

          {(role === 'manager' || role === 'supervisor') && (
            <>
              {/* Vista original para Manager/Supervisor */}
              <Grid size={{ xs: 12, md: 6 }}>
                  <DashboardChartCard
                    title="Personas a Cargo por Área"
                    empty={barDataPeopleByArea.length === 0}
                  >         
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barDataPeopleByArea}
                        margin={{ top: 0, right: 20, left: 10, bottom: 10 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}`, 'Personas']} />
                        <Bar dataKey="count" fill={theme.palette.primary.main} />
                      </BarChart>
                    </ResponsiveContainer>         
                </DashboardChartCard>  
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                  <DashboardChartCard
                    title= {role === 'manager'
                        ? 'Huellas Asignadas por Categoría'
                        : 'Huellas Ganadas por Categoría'}
                    empty={pieDataManager.length === 0}
                  >      

                  <ResponsiveContainer height="100%">
                    <PieChart margin={{ top: 30, right: 0, left: 0, bottom: 30 }}>
                      <Pie
                        data={pieDataManager}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={'80%'}
                        label={({ name, percentage }) => {
                          if (!percentage) return `${name}: 0%`;
                          const formatted = percentage.toFixed(2);
                          const trimmed = formatted.replace(/\.?0+$/, '');
                          return `${name}: ${trimmed}%`;
                        }}
                      >
                        {pieDataManager.map((_entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => {
                          const data = props?.payload;
                          if (!data) return [`${value} huellas`, name];

                          const percent = data.percentage ?? 0;
                          const formattedPercent = percent.toFixed(2).replace(/\.?0+$/, '');

                          return [`${value} huellas`, `${name} - ${formattedPercent}%`];
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </DashboardChartCard>  
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <DashboardChartCard
                  title="Canjes Realizados por Mes"
                  empty={barDataMonthlyRedemptionsByTeam.length === 0}
                >                       
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={barDataMonthlyRedemptionsByTeam} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                      <XAxis
                        dataKey="name"
                        tickFormatter={(month) => month.substring(0, 3)} 
                      />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="canjes"
                        stroke={theme.palette.publicisPurple.main}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </DashboardChartCard>  
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <DashboardChartCard
                  title= {role === 'manager'
                      ? 'Huellas Asignadas por Área'
                      : 'Huellas Ganadas por Área'}
                  empty={barDataMonthlyRedemptionsByTeam.length === 0}
                >     
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barDataPointsByArea} margin={{ top: 0, right: 20, left: 10, bottom: 10 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                          <Tooltip formatter={(value) => [`${value}`, role === 'manager' ? 'Huellas asignadas' : 'Huellas ganadas']} />
                      <Bar dataKey="points" fill={theme.palette.publicisPurple.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </DashboardChartCard>  
              </Grid>
            </>
          )}
          {(role === 'colaborador') && (
          <>
           {/* Vista original para Colaborador */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
                    borderRadius: 3,
                    '&:hover': {
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', 
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Huellas Ganadas por Categoría
                    </Typography>
                  </CardContent>
                   <Box sx={{ flexGrow: 1, px: 2, height: isDesktop ? '100%' : 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {pieDataCollaborator.length === 0 ? (
                      <Typography variant="subtitle1" color="text.secondary" textAlign="center">
                        No hay datos disponibles para mostrar.
                      </Typography>
                    ) : (
                      <ResponsiveContainer height="100%" width="100%">
                        <PieChart margin={{ top: 30, right: 0, left: 0, bottom: 30 }}>
                          <Pie
                            data={pieDataCollaborator}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={'80%'}
                            label={({ name, percent }) => {
                            if (!percent) return `${name}: 0%`;
                            const formatted = (percent * 100).toFixed(2);
                            const trimmed = formatted.replace(/\.?0+$/, '');
                            return `${name}: ${trimmed}%`;
                          }}
                          >
                            {pieDataCollaborator.map((_entry, index) => (
                              <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => {
                              const data = props?.payload;
                              if (!data) return [`${value} huellas`, name];


                              const percent = data.percentage ?? 0;
                              const formattedPercent = percent.toFixed(2).replace(/\.?0+$/, '');

                              return [`${value} huellas`, `${name} - ${formattedPercent}%`];
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </Box>

                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
                    borderRadius: 3,
                    '&:hover': {
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', 
                    },
                  }}
                >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    Canjes Realizados por Año
                  </Typography>
                </CardContent>
                <Box sx={{ flexGrow: 1, height: isDesktop ? '98%' : 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {barDataPointsByYear.length === 0 ? (
                    <Typography variant="subtitle1" color="text.secondary" textAlign="center">
                      No hay datos disponibles para mostrar.
                    </Typography>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barDataPointsByYear}
                        margin={{ top: 0, right: 20, left: 10, bottom: 10 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, _name, props) => {
                            const points = props.payload?.points ?? 0;
                            return [`${value} canjes / ${points} huellas`];
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill={theme.palette.publicisPurple.main}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </Card>
            </Grid>
          </>
           )}
        </Grid>
      </Box>
    </Box>
  );
}
