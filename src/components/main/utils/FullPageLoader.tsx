import { Box, LinearProgress} from '@mui/material';

function FullPageLoader() {
  return (
    <Box
      sx={{
        height: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Box sx={{ width: '60%', maxWidth: 400 }}>
        <LinearProgress />
      </Box>
    </Box>
  );
}

export default FullPageLoader;
