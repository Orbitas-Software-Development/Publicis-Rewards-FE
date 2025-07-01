import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/forgotPassword';
import ResetPasswordPage from '../pages/auth/ResetPassword';

import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/main/HomePage';
import SettingsPage from '../pages/main/SettingsPage';
import { ProtectedRoute } from './ProtectedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout público */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Layout privado con rutas protegidas */}
        <Route path="/" element={<MainLayout />}>
          <Route
            path="inicio"
            element={
              <ProtectedRoute roles={['Administrador', 'Supervisor', 'Colaborador']}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="colaboradores"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <HomePage />
              </ProtectedRoute>
            }
          />
           <Route
            path="huellas"
            element={
              <ProtectedRoute roles={['Administrador', 'Supervisor']}>
                <HomePage /> {/* Aquí podrías tener un layout específico para huellas */}
              </ProtectedRoute>
            }
          >
            <Route
              path="asignar"
              element={
                <ProtectedRoute roles={['Administrador', 'Supervisor']}>
                     <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="categorias"
              element={
                <ProtectedRoute roles={['Administrador', 'Supervisor']}>
                     <HomePage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="premios"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reportes"
            element={
              <ProtectedRoute roles={['Administrador', 'Supervisor']}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="configuracion"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="equipo"
            element={
              <ProtectedRoute roles={['Supervisor']}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="mis-huellas"
            element={
              <ProtectedRoute roles={['Colaborador']}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="catalogo"
            element={
              <ProtectedRoute roles={['Colaborador']}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="historial"
            element={
              <ProtectedRoute roles={['Colaborador']}>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
