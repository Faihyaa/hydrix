import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
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
import { PublicLayout } from './components/PublicLayout';

// ============================================
// ROUTE GUARDS
// ============================================

function PublicLayoutWrapper() {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
}

function UserLayoutWrapper() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function AdminLayoutWrapper() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Admin') return <Navigate to="/" replace />;
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

// ============================================
// ROUTER CONFIGURATION
// ============================================

function MainLayoutWrapper() {
  const { user } = useAuth();

  if (!user) {
    return (
      <PublicLayout>
        <Outlet />
      </PublicLayout>
    );
  }

  if (user.role === 'Admin') {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function PublicOnlyWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user?.role === 'Admin') {
    return <Navigate to="/admin/users" replace />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <PublicLayout>{children}</PublicLayout>;
}

export const router = createBrowserRouter([
  // ============================================
  // MAIN SHARED PAGES
  // ============================================
  {
    element: <MainLayoutWrapper />,
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
      }
    ]
  },

  // ============================================
  // AUTHENTICATION PAGES
  // ============================================
  {
    element: <PublicOnlyWrapper>
      <Outlet />
    </PublicOnlyWrapper>,
    children: [
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
      }
    ]
  },

  // ============================================
  // DASHBOARD - Registered users only
  // ============================================
  {
    element: <UserLayoutWrapper />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />
      }
    ]
  },

  // ============================================
  // ADMIN ROUTES - Admin Users Only
  // ============================================
  {
    element: <AdminLayoutWrapper />,
    children: [
      {
        path: '/admin/users',
        element: <AdminUsers />
      },
      {
        path: '/admin/history',
        element: <AdminHistory />
      }
    ]
  },

  // ============================================
  // CATCH ALL - 404 Not Found
  // ============================================
  {
    path: '*',
    element: <NotFound />
  }
]);