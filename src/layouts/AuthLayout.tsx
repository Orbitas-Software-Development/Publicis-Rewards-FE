// AuthLayout.tsx
import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { TypeAnimation } from 'react-type-animation';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import Header from '../components/auth/Header';
import background from '../assets/images/background1.jpg';
import huella from '../assets/images/huella6.png';

const BackgroundContainer = styled('div')({
  position: 'relative',
  minHeight: '100vh',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  overflow: 'hidden',

});


const GlassBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  width: '100%',
  maxWidth: 1000,
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: `0 4px 16px 0 ${theme.palette.publicisTurquoise.main}30`,
  backdropFilter: 'blur(5px)',
  color: theme.palette.publicisGrey.light,
  marginTop: '80px',
  zIndex: 2
}));

const ContentRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  flex: '0 0 55%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(4),
  borderRight: `1px solid ${theme.palette.grey[400]}33`,
  boxShadow: `inset -1px 0 0 0 ${theme.palette.grey[300]}22`, 
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5),
    borderRight: 'none',
    boxShadow: 'none',
  },
}));


const ImageSection = styled(Box)(({ theme }) => ({
  flex: '0 0 45%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5),
  },
}));


export default function AuthLayout() {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  let fontSize = '1.5rem';
  if (isXs) fontSize = '1rem';
  else if (isSm) fontSize = '1.2rem';

  return (
    <BackgroundContainer>
      <Header />
      <GlassBox>
        <ContentRow>
          <FormSection>
            <Outlet />
          </FormSection>

          <ImageSection>
            {/* Sección derecha SIN animaciones para evitar parpadeo */}
            <TypeAnimation
              sequence={['Celebremos las huellas que marcas en nuestra historia.', 1500]}
              wrapper="span"
              speed={60}
              style={{
                fontSize,
                color: theme.palette.publicisGrey.light,
                fontWeight: 500,
                display: 'inline-block',
                fontFamily: 'ITC New Baskerville Roman',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}
              cursor={false}
            />
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
              <img
                src={huella}
                alt="Huella decorativa"
                style={{
                  width: '50%',
                  maxWidth: '250px',
                  height: 'auto',
                  objectFit: 'contain',
                  margin: '10px',
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: theme.palette.publicisGrey.main, textAlign: 'center' }}>
              © 2025 Re:Sources. Todos los derechos reservados.
            </Typography>
          </ImageSection>
        </ContentRow>
      </GlassBox>
    </BackgroundContainer>
  );
}
