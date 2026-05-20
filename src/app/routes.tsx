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

function HomeRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
<<<<<<< HEAD
  if (user.role.toLowerCase() === 'admin') return <Navigate to="/admin/users" replace />;
=======
  if (user.role === 'Admin') return <Navigate to="/admin/users" replace />;
>>>>>>> 8c9334e9 (Integrate EmailJS flood warning and alert notifications)
  return (
    <AuthLayout>
      <Home />
    </AuthLayout>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
<<<<<<< HEAD
  return user.role === 'admin' ? <AdminLayout>{children}</AdminLayout> : <Layout>{children}</Layout>;
=======
  return user.role === 'Admin' ? <AdminLayout>{children}</AdminLayout> : <Layout>{children}</Layout>;
>>>>>>> 8c9334e9 (Integrate EmailJS flood warning and alert notifications)
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
<<<<<<< HEAD
    return user.role === 'admin' ? <Navigate to="/admin/users" replace /> : <Navigate to="/" replace />;
=======
    return user.role === 'Admin' ? <Navigate to="/admin/users" replace /> : <Navigate to="/dashboard" replace />;
>>>>>>> 8c9334e9 (Integrate EmailJS flood warning and alert notifications)
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
    element: <HomeRoute />
  },
  {
    path: '/about',
    element: (
      <PrivateRoute>
        <AuthLayout>
          <AboutUs />
        </AuthLayout>
      </PrivateRoute>
    )
  },
  {
    path: '/functionality',
    element: (
      <PrivateRoute>
        <AuthLayout>
          <Functionality />
        </AuthLayout>
      </PrivateRoute>
    )
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <AuthLayout>
          <Dashboard />
        </AuthLayout>
      </PrivateRoute>
    )
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <Navigate to="/admin/users" replace />
      </AdminRoute>
    )
  },
  {
    path: '/contact',
    element: (
      <PrivateRoute>
        <AuthLayout>
          <Contact />
        </AuthLayout>
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