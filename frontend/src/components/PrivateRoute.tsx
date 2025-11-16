import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

/*
- redireciona p login se nao autenticado
- redireciona para pagina nao autorizada se n tiver a role necessaria
*/
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  allowedRoles,
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          Carregando...
        </Typography>
      </Box>
    );
  }

  // se requer autenticação e n ta autenticado, redireciona para login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // se especificou roles permitidos, verifica se o usuário tem permissão
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasRole(allowedRoles)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // se passou por todas as verificações, mostra conteudo
  return <>{children}</>;
};

//redireciona usuarios ja autenticados (rota publica)
export const PublicRoute: React.FC<{ 
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // se o usuário já está autenticado -> redireciona
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // se n está autenticado -> renderiza o children (página de login)
  return <>{children}</>;
};

export default PrivateRoute;