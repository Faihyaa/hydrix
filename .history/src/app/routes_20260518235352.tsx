import { createBrowserRouter, Navigate } from 'react-router';
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

/*function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}*/

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Admin') return <Navigate to="/" replace />;
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
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: '/about',
    element: (
      <ProtectedRoute>
        <AboutUs />
      </ProtectedRoute>
    )
  },
  {
    path: '/functionality',
    element: (
      <ProtectedRoute>
        <Functionality />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/contact',
    element: (
      <ProtectedRoute>
        <Contact />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/history',
    element: (
      <ProtectedRoute>
        <AdminHistory />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute>
        <AdminUsers />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <NotFound />
  }
]);