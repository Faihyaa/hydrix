import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Droplets, LogOut, User, Menu, X, Sun, Moon } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { useState } from 'react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Admin links only if user is admin
  const adminLinks = [
    { name: 'Activity History', path: '/admin/history' },
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Simplified Admin Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-white/70 backdrop-blur-xl border border-blue-200/50 z-50 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                <Droplets className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-bold text-xl text-blue-900">HydriX</h1>
                <p className="text-xs text-blue-600">Admin Panel</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
              {user?.role === 'Admin' &&
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

            {user && (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-700">
                  <User className="text-blue-600" size={18} />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                
                <div className="hidden md:block h-6 w-px bg-blue-200"></div>
                
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>

                {/* Mobile Menu Toggle */}
                <Button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-blue-600"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          {user && mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-blue-200 space-y-3 animate-slide-down">
              {adminLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm py-2 px-3 rounded-lg transition-colors ${
                    isActive(link.path) ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex items-center gap-2 py-2 px-3 text-sm text-gray-700 bg-blue-50 rounded-lg">
                <User className="text-blue-600" size={18} />
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">{children}</main>
    </div>
  );
}