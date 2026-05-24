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

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
    return user.role === 'admin' ? <Navigate to="/admin/users" replace /> : <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    )
  },
  {
    path: '/signup',
    element: (
      <GuestRoute>
        <Signup />
      </GuestRoute>
    )
  },
  {
    path: '/forgot-password',
    element: (
      <GuestRoute>
        <ForgotPassword />
      </GuestRoute>
    )
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Layout>
          <Home />
        </Layout>
      </PrivateRoute>
    )
  },
  {
    path: '/about',
    element: (
      <PrivateRoute>
        <Layout>
          <AboutUs />
        </Layout>
      </PrivateRoute>
    )
  },
  {
    path: '/functionality',
    element: (
      <PrivateRoute>
        <Layout>
          <Functionality />
        </Layout>
      </PrivateRoute>
    )
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
    element: (
      <PrivateRoute>
        <Layout>
          <Contact />
        </Layout>
      </PrivateRoute>
    )
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