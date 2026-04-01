import { createBrowserRouter, Navigate } from 'react-router';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Functionality from './pages/Functionality';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import AdminHistory from './pages/AdminHistory';
import AdminUsers from './pages/AdminUsers';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
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
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Admin />
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