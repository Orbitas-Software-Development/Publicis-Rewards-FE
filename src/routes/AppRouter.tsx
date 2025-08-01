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
import EmployeesPage from '../pages/main/EmployeesPage';
import TeamPage from '../pages/main/TeamPage';
import UsersPage from '../pages/main/UsersPage';
import UserProfilePage from '../pages/main/UserProfilePage';
import BadgeCategoriesPage from '../pages/main/BadgeCategoriesPage';
import BadgeLayout from '../layouts/BadgeLayout';
import PrizesPage from '../pages/main/PrizesPage';
import BadgeManagementPage from '../pages/main/BadgeAssignmentPage';
import CatalogPage from '../pages/main/CatalogPage';
import RedemptionsHistoryPage from '../pages/main/RedemptionsHistoryPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout público */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="iniciar-sesion" element={<LoginPage />} />
          <Route path="registrarse" element={<RegisterPage />} />
          <Route path="olvide-contrasena" element={<ForgotPasswordPage />} />
          <Route path="restablecer-contrasena" element={<ResetPasswordPage />} />
        </Route>

        {/* Layout privado con rutas protegidas */}
        <Route path="/" element={<MainLayout />}>
          <Route
            path="inicio"
            element={
              <ProtectedRoute roles={['Administrador', 'Supervisor','Manager', 'Colaborador']}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="perfil/:userId"
            element={
              <ProtectedRoute roles={['Administrador', 'Supervisor', 'Manager', 'Colaborador']}>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="colaboradores"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="huellas"
            element={
              <ProtectedRoute roles={['Administrador', 'Manager']}>
                <BadgeLayout /> {/* ahora sí es un contenedor válido */}
              </ProtectedRoute>
            }
          >
            <Route
              path="asignaciones"
              element={
                <ProtectedRoute roles={['Administrador', 'Manager']}>
                  <BadgeManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="categorias"
              element={
                <ProtectedRoute roles={['Administrador']}>
                  <BadgeCategoriesPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="premios"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <PrizesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="canjes"
            element={
              <ProtectedRoute roles={['Administrador']}>
                 <RedemptionsHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reportes"
            element={
              <ProtectedRoute roles={['Administrador', 'Supervisor', 'Manager']}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="usuarios"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <UsersPage />
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
              <ProtectedRoute roles={['Supervisor','Manager']}>
                <TeamPage/>
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
                <CatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="historial"
            element={
              <ProtectedRoute roles={['Colaborador']}>
                <RedemptionsHistoryPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
