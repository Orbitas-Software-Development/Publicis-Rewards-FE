import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface Props {
  children: ReactNode;
  roles?: string[];
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

  // Autenticado pero sin permiso
  if (roles && (!user || !roles.includes(user.role.name))) {
    // Redirige a una ruta por defecto o muestra un acceso denegado
    return <Navigate to="/inicio" replace />;
    // O puedes mostrar un componente de acceso denegado:
    // return <AccessDenied />;
  }

  return <>{children}</>;
}