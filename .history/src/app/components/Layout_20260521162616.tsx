import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Droplets, LogOut, User, Bell, BellOff, Menu, X, Sun, Moon } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { AnimatedBackground } from './AnimatedBackground';
import { useEffect, useRef, useState } from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, updateNotificationPreference } = useAuth();
  const { isDark, toggleTheme } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Header */}
      <header
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl backdrop-blur-xl border z-50 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
      >
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                <Droplets className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-bold text-xl text-blue-900">HydriX</h1>
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
                  Contact Us
                </Link>
              </nav>
            )}

            {user && (
              <div className="flex items-center gap-4">
                <Button
                  onClick={toggleTheme}
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2 text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-blue-50 dark:hover:bg-slate-700"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </Button>

                <div className="hidden md:block h-6 w-px bg-blue-200"></div>

                <div className="hidden md:flex items-center gap-2">
                  {user.notifications ? (
                    <Bell className="text-blue-600" size={16} />
                  ) : (
                    <BellOff className="text-gray-400" size={16} />
                  )}
                  <Switch
                    checked={user.notifications}
                    onCheckedChange={updateNotificationPreference}
                    id="notifications"
                    className={user.notifications ? 'data-[state=checked]:bg-blue-600' : ''}
                  />
                  <Label htmlFor="notifications" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    Alerts
                  </Label>
                </div>

                <div className="hidden md:block h-6 w-px bg-blue-200"></div>

                <div ref={profileRef} className="relative hidden md:flex items-center">
                  <Button
                    onClick={() => setProfileOpen((prev) => !prev)}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <User className="text-blue-600" size={18} />
                    <div className="text-left">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </Button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/40">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Profile</p>
                      <p className="mt-3 text-sm font-semibold text-slate-900">{user.email}</p>
                      <Button
                        onClick={() => {
                          setProfileOpen(false);
                          handleLogout();
                        }}
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </Button>
                    </div>
                  )}
                </div>

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
            <div
              className="md:hidden mt-4 pt-4 space-y-3 animate-slide-down"
              style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
            >
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm py-2 px-3 rounded-lg transition-colors ${
                  isActive('/') ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm py-2 px-3 rounded-lg transition-colors ${
                  isActive('/about') ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                About Us
              </Link>
              <Link
                to="/functionality"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm py-2 px-3 rounded-lg transition-colors ${
                  isActive('/functionality') ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                Functionality
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm py-2 px-3 rounded-lg transition-colors ${
                  isActive('/dashboard') ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                IoT Dashboard
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm py-2 px-3 rounded-lg transition-colors ${
                  isActive('/contact') ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                Contact Us
              </Link>

              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </Button>

              <div className="flex items-center gap-2 py-2 px-3">
                {user.notifications ? (
                  <Bell className="text-blue-600" size={16} />
                ) : (
                  <BellOff className="text-gray-400" size={16} />
                )}
                <Switch
                  checked={user.notifications}
                  onCheckedChange={updateNotificationPreference}
                  id="notifications-mobile"
                  className={user.notifications ? 'data-[state=checked]:bg-blue-600' : ''}
                />
                <Label htmlFor="notifications-mobile" className="text-xs text-gray-600 cursor-pointer">
                  Alerts
                </Label>
              </div>

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

      {/* Footer */}
      <footer className="backdrop-blur-md mt-16" style={{ backgroundColor: 'var(--card)', borderTop: '1px solid var(--border)' }}>
        <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-300">
          © 2026 HydriX. All rights reserved.
        </div>
      </footer>
    </div>
  );
}