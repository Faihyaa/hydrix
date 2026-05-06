import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Droplets, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { app } from "@/lib/firebase";
import { getAuth } from "firebase/auth";

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const success = await signup(email, password, name, notifications);
      if (success) {
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        toast.error('Email already exists');
      }
    } catch (error) {
      toast.error('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 gap-8">
      <AnimatedBackground />

      {/* TOP — Centered Header */}
      <div className="relative z-10 flex flex-col items-center gap-2 animate-fade-in text-center">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-3 rounded-xl shadow-md">
          <Droplets className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-blue-900 mt-1">Join FlooDeT</h1>
        <p className="text-gray-500 text-sm">Create your account and start monitor today!</p>
      </div>

      {/* BOTTOM — Landscape Card */}
      <Card className="relative z-10 border-blue-100 shadow-lg w-full max-w-3xl animate-slide-in-left">
        <CardContent className="px-8 py-7">
          <form onSubmit={handleSignup} className="space-y-5">

            {/* Card Header inline */}
            <div className="border-b border-blue-50 pb-4 text-center">
              <h2 className="text-xl font-bold text-gray-800">Create Account</h2>
              <p className="text-sm text-gray-500 mt-0.5">Enter your details to get started</p>
            </div>

            {/* Row 1: Username + Email */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-9 h-10 text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 h-10 text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Password + Confirm Password */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-9 h-10 text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-9 h-10 text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Notifications + Submit */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 rounded-lg border border-blue-100">
                <Checkbox
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={(checked) => setNotifications(checked as boolean)}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label
                    htmlFor="notifications"
                    className="text-sm font-medium text-gray-700 cursor-pointer leading-snug"
                  >
                    Enable email notifications
                  </Label>
                  <p className="text-xs text-gray-500 leading-snug">
                    Receive real-time flood alerts and system updates via email.
                  </p>
                </div>
              </div>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-sm font-medium w-full rounded-lg"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 pt-1">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Login
              </Link>
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}