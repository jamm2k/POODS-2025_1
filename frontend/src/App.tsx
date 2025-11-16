import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PrivateRoute, PublicRoute } from './components/PrivateRoute';

import LoginPage from './pages/Auth/LoginPage';
import DashboardGarcom from './pages/Garcom/DashboardGarcom';
import DashboardCozinha from './pages/Cozinha/DashboardCozinha';
import DashboardAdmin from './pages/Admin/DashboardAdmin';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';


//componente de redirecionamento inteligente baseado no tipo de usuario
const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //redirecionamentos
  switch (user.tipoUsuario) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'GARCOM':
      return <Navigate to="/garcom" replace />;
    case 'COZINHEIRO':
      return <Navigate to="/cozinha" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* rota publica */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* rota raiz - redireciona baseado na autenticação */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardRedirect />
              </PrivateRoute>
            }
          />

          {/* dashboard principal - redireciona baseado no tipo de usuário */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardRedirect />
              </PrivateRoute>
            }
          />

          <Route
            path="/garcom/*"
            element={
              <PrivateRoute allowedRoles={['GARCOM', 'ADMIN']}>
                <DashboardGarcom />
              </PrivateRoute>
            }
          />

          <Route
            path="/cozinha/*"
            element={
              <PrivateRoute allowedRoles={['COZINHEIRO', 'ADMIN']}>
                <DashboardCozinha />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <DashboardAdmin />
              </PrivateRoute>
            }
          />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;