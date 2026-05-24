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
import ( AdminLayout} from './components/AdminLayout';
import { PublicLayout } from './components/PublicLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AuthLayout() {
  const { user } = useAuth();
  
  // Show admin layout for admin users
  if (user?.role === 'Admin') {
    return <AdminLayout><Outlet /></AdminLayout>;
  }
  
  // Show registered user layout for authenticated users
  if (user) {
    return <Layout><Outlet /></Layout>;
  }
  
  // Show public layout for non-authenticated users
  return <PublicLayout><Outlet /></PublicLayout>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <PublicLayout><Login /></PublicLayout>
  },
  {
    path: '/signup',
    element: <PublicLayout><Signup /></PublicLayout>
  },
  {
    path: '/forgot-password',
    element: <PublicLayout><ForgotPassword /></PublicLayout>
  },
  {
    // Main layout route - conditionally applies correct layout
    element: <AuthLayout />,
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
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
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
        path: '/admin/history',
        element: (
          <AdminRoute>
            <AdminHistory />
          </AdminRoute>
        )
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);