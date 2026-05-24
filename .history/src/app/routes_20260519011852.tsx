import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';

// Layouts
import { PublicLayout } from '../components/PublicLayout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Functionality from './pages/Functionality';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import AdminHistory from './pages/AdminHistory';
import AdminUsers from './pages/AdminUsers';
import NotFound from './pages/NotFound';

/**
 * Route Guards
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

/**
 * Router Configuration
 */
export const router = createBrowserRouter([
  // 1. Public Routes wrapped in PublicLayout
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <AboutUs /> },
      { path: '/functionality', element: <Functionality /> },
      { path: '/contact', element: <Contact /> },
    ]
  },

  // 2. Auth Routes (usually stand-alone without the main layout)
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/forgot-password', element: <ForgotPassword /> },

  // 3. Protected User Routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },

  // 4. Protected Admin Routes
  {
    path: '/admin/history',
    element: (
      <AdminRoute>
        <AdminHistory />
      </AdminRoute>
    )
  },
  {
    path: '/admin/users',
    element: (
      <AdminRoute>
        <AdminUsers />
      </AdminRoute>
    )
  },

  // 5. Catch-all Route
  { path: '*', element: <NotFound /> }
]);