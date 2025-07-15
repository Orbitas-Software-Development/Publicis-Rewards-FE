import { Box, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import type { FC } from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Icon icon="mdi:alert-circle-outline" width={48} height={48} color="#d32f2f" />
      <Typography variant="h6" color="error">
        Ocurrió un error
      </Typography>
      <Typography color="error" sx={{ maxWidth: 400 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default ErrorMessage;
