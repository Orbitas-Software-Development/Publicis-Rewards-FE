import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface Props {
  children: ReactNode;
  roles?: string[]; // roles requeridos
}

export function ProtectedRoute({ children, roles }: Props) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Validar roles
  if (roles && (!user || !roles.includes(user.activeRole.name))) {
    return <Navigate to="/inicio" replace />;
    // O retornar un componente de acceso denegado:
    // return <AccessDenied />;
  }

  return <>{children}</>;
}
