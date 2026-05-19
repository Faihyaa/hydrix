import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
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
import { Layout } from './components/Layout';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/AdminLayout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function PublicPage({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) return <Layout>{children}</Layout>;
  return <PublicLayout>{children}</PublicLayout>;
}

function PublicGuestPage({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
    return user.role === 'admin' ? <Navigate to="/admin/users" replace /> : <Navigate to="/dashboard" replace />;
  }
  return <PublicLayout>{children}</PublicLayout>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <PublicGuestPage><Login /></PublicGuestPage>
  },
  {
    path: '/signup',
    element: <PublicGuestPage><Signup /></PublicGuestPage>
  },
  {
    path: '/forgot-password',
    element: <PublicGuestPage><ForgotPassword /></PublicGuestPage>
  },
  {
    path: '/',
    element: <PublicPage><Home /></PublicPage>
  },
  {
    path: '/about',
    element: <PublicPage><AboutUs /></PublicPage>
  },
  {
    path: '/functionality',
    element: <PublicPage><Functionality /></PublicPage>
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </PrivateRoute>
    )
  },
  {
    path: '/contact',
    element: <PublicPage><Contact /></PublicPage>
  },
  {
    path: '/admin/history',
    element: (
      <AdminRoute>
        <AdminLayout>
          <AdminHistory />
        </AdminLayout>
      </AdminRoute>
    )
  },
  {
    path: '/admin/users',
    element: (
      <AdminRoute>
        <AdminLayout>
          <AdminUsers />
        </AdminLayout>
      </AdminRoute>
    )
  },
  {
    path: '*',
    element: <NotFound />
  }
]);