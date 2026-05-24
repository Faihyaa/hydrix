import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';
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

export const router = createBrowserRouter([
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
  {
    path: '/',
    element: (
        <Home />
    )
  },
  {
    path: '/about',
    element: (
        <AboutUs />
    )
  },
  {
    path: '/functionality',
    element: (
        <Functionality />
    )
  },
  {
    path: '/dashboard',
    element: (
      <
        <Dashboard />
    )
  },
  {
    path: '/contact',
    element: (
        <Contact />
    )
  },
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
  {
    path: '*',
    element: <NotFound />
  }
]);