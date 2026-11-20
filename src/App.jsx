import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Dashboard from './pages/dashboard/Dashboard';
import Projects from './pages/dashboard/Projects';
import ProjectDetails from './pages/dashboard/ProjectDetails';
import ProjectMembersPage from './pages/dashboard/ProjectMembersPage';
import Tickets from './pages/dashboard/Tickets';
import KanbanBoard from './pages/dashboard/KanbanBoard';
import TicketDetails from './pages/dashboard/TicketDetails';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? '/dashboard' : '/login'}
            replace
          />
        }
      />

      {/* AUTHENTICATION ROUTES */}
      <Route
        element={
          <AuthLayout>
            <Outlet />
          </AuthLayout>
        }
      >
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
          }
        />
      </Route>

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/projects" element={<Projects />} />

          <Route
            path="/projects/:projectId"
            element={<ProjectDetails />}
          />

          <Route
            path="/projects/:projectId/members"
            element={<ProjectMembersPage />}
          />

          <Route
            path="/projects/:projectId/tickets"
            element={<Tickets />}
          />

          <Route
            path="/projects/:projectId/kanban"
            element={<KanbanBoard />}
          />

          <Route
            path="/projects/:projectId/tickets/:ticketId"
            element={<TicketDetails />}
          />
        </Route>
      </Route>

      {/* UNKNOWN ROUTES */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;