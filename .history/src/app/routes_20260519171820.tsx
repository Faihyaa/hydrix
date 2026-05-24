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
// CONDITIONAL LAYOUT WITH DEBUGGING
// ============================================
function ConditionalLayout() {
  const { user, loading } = useAuth();

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('🔍 ConditionalLayout Debug:', {
    userExists: !!user,
    userName: user?.name,
    userRole: user?.role,
    isAdmin: user?.role === 'Admin',
  });

  // Admin users get AdminLayout
  if (user && user.role === 'Admin') {
    console.log('✅ Rendering AdminLayout');
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }

  // Authenticated users get Layout
  if (user) {
    console.log('✅ Rendering Layout (registered user)');
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }

  // Everyone else gets PublicLayout
  console.log('✅ Rendering PublicLayout (public user)');
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
}

// ============================================
// ROUTE PROTECTION GUARDS
// ============================================
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

// ============================================
// ROUTER CONFIGURATION
// ============================================
export const router = createBrowserRouter([
  {
    // Main layout wrapper - conditionally shows correct layout
    element: <ConditionalLayout />,
    children: [
      // PUBLIC & REGISTERED USER SHARED PAGES
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

      // REGISTERED USER ONLY
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },

      // ADMIN ONLY
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

      // 404 FALLBACK
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);