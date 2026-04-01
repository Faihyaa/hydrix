import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Droplets, LogOut, User } from 'lucide-react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Admin links only if user is admin
  const adminLinks = [
    { name: 'Control Panel', path: '/admin' },
    { name: 'Activity History', path: '/admin/history' },
    { name: 'User Management', path: '/admin/users' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Simplified Admin Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                  <Droplets className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="font-bold text-xl text-blue-900">FlooDeT</h1>
                  <p className="text-xs text-blue-600">Admin Panel</p>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-4 ml-8">
                {user?.role === 'admin' &&
                  adminLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-sm transition-colors px-3 py-2 rounded-lg ${
                        isActive(link.path)
                          ? 'text-blue-600 font-semibold bg-blue-50'
                          : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
              </nav>
            </div>

            {user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                  <User className="text-blue-600" size={18} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}