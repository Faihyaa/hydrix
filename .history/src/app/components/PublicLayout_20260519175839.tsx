import { Link, useNavigate, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Droplets, Menu, X, Sun, Moon } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { useState } from 'react';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      {/* Public Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-white/70 backdrop-blur-xl border border-blue-200/50 z-50 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl">
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
                to="/login"
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

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setDarkMode(!darkMode)}
                variant="ghost"
                size="sm"
                className="hidden md:flex text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>

              <div className="hidden md:block h-6 w-px bg-blue-200"></div>

              <Button
                onClick={() => navigate('/login')}
                variant="ghost"
                size="sm"
                className="hidden md:flex text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                Login
              </Button>

              <Button
                onClick={() => navigate('/signup')}
                size="sm"
                className="hidden md:flex bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
              >
                Sign Up
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
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-blue-200 space-y-3 animate-slide-down">
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
                to="/login"
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
                onClick={() => setDarkMode(!darkMode)}
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </Button>

              <div className="pt-2 space-y-2">
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/signup');
                  }}
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">{children}</main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-md border-t border-blue-100 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © 2026 HydriX. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
