import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Droplets, LogOut, User, Bell, BellOff } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, updateNotificationPreference } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                <Droplets className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-bold text-xl text-blue-900">FlooDeT</h1>
                <p className="text-xs text-blue-600">Early Flood Detection</p>
              </div>
            </Link>

            {user && (
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/"
                  className={`text-sm transition-colors ${
                    isActive('/') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`text-sm transition-colors ${
                    isActive('/about') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  About Us
                </Link>
                <Link
                  to="/functionality"
                  className={`text-sm transition-colors ${
                    isActive('/functionality') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  Functionality
                </Link>
                <Link
                  to="/dashboard"
                  className={`text-sm transition-colors ${
                    isActive('/dashboard') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  IoT Dashboard
                </Link>
                <Link
                  to="/contact"
                  className={`text-sm transition-colors ${
                    isActive('/contact') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  Contact
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`text-sm transition-colors ${
                      isActive('/admin') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500'
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}
              </nav>
            )}

            {user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {user.notifications ? (
                      <Bell className="text-blue-600" size={16} />
                    ) : (
                      <BellOff className="text-gray-400" size={16} />
                    )}
                    <Switch
                      checked={user.notifications}
                      onCheckedChange={updateNotificationPreference}
                      id="notifications"
                    />
                    <Label htmlFor="notifications" className="text-xs text-gray-600 cursor-pointer">
                      Alerts
                    </Label>
                  </div>
                </div>
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

      {/* Footer */}
      <footer className="bg-white border-t border-blue-100 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                  <Droplets className="text-white" size={20} />
                </div>
                <span className="font-bold text-lg text-blue-900">FlooDeT</span>
              </div>
              <p className="text-sm text-gray-600">
                Advanced flood detection system with real-time monitoring and alerts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link to="/about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  About Us
                </Link>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Contact</h3>
              <p className="text-sm text-gray-600">Email: info@floodet.com</p>
              <p className="text-sm text-gray-600">Support: support@floodet.com</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-blue-100 text-center text-sm text-gray-500">
            © 2026 FlooDeT. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}