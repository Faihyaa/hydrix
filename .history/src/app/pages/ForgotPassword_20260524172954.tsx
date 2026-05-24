import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, ArrowLeft, Droplets, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedBackground } from '../components/AnimatedBackground';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Check if user exists in admin list first
    if (email === 'adminhydrix@gmail.com') {
      toast.error('Cannot reset core admin password. Please contact system administrator.');
      return;
    }

    // Get all users
    const users = JSON.parse(localStorage.getItem('hydrix_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex === -1) {
      toast.error('No account found with this email address');
      return;
    }

    // Update user password
    users[userIndex].password = newPassword;
    localStorage.setItem('hydrix_users', JSON.stringify(users));

    toast.success('Password reset successfully! Please log in with your new password.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-3 rounded-xl">
              <Droplets className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Reset your password to regain access</p>
        </div>

        <Card className="border-blue-100 shadow-lg animate-slide-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <KeyRound className="text-blue-600" size={24} />
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and new password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Reset Password
              </Button>

              <Link to="/login" className="block">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-blue-600 hover:bg-blue-50"
                >
                  <ArrowLeft className="mr-2" size={18} />
                  Back to Login
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
