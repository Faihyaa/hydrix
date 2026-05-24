import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';

// Import Layout
import { PublicLayout } from '../components/PublicLayout';

// Import Pages
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
 * Route Guard for Authenticated Users
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/**
 * Route Guard for Admin Users
 */
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
  // Public Routes wrapped in the PublicLayout
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about',
        element: <AboutUs />
      },
      {
        path: '/functionality',
        element: <Functionality />
      },
      {
        path: '/contact',
        element: <Contact />
      },
    ]
  },

  // Auth Routes (Usually without the main public layout)
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },

  // User Dashboard (Protected)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },

  // Admin Specific Routes (Protected)
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

  // 404 Catch-all
  {
    path: '*',
    element: <NotFound />
  }
]);