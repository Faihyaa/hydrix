import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, ArrowLeft, Droplets, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedBackground } from '../components/AnimatedBackground';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Prevent reset for core admin
    if (email === 'adminhydrix@gmail.com') {
      toast.error('Cannot reset core admin password. Please contact system administrator.');
      return;
    }

    setLoading(true);
    try {
      const success = await resetPassword(email);
      if (success) {
        setSubmitted(true);
        toast.success('Password reset email sent! Check your inbox.');
        // Auto redirect after 5 seconds
        setTimeout(() => navigate('/login'), 5000);
      } else {
        toast.error('Failed to send reset email. Please check the email address and try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-3 rounded-xl shadow-md">
              <Droplets className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">
            {submitted 
              ? 'Check your email for password reset instructions' 
              : 'No worries, we\'ll send you reset instructions'}
          </p>
        </div>

        <Card className="border-blue-100 shadow-lg animate-slide-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              {submitted 
                ? 'Follow the link in your email to reset your password'
                : 'Enter your email and we\'ll send you a link to reset your password'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 mb-2">
                    <strong>Email sent successfully!</strong>
                  </p>
                  <p className="text-sm text-green-700">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    If you don't see the email, check your spam folder or try again in a few minutes.
                  </p>
                </div>

                <Link to="/login" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Back to Login
                  </Button>
                </Link>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setSubmitted(false)}
                >
                  Try Another Email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-10 text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the email address associated with your account
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-sm font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>

                <Link to="/login" className="block">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-blue-600 hover:bg-blue-50 text-sm"
                  >
                    <ArrowLeft className="mr-2" size={18} />
                    Back to Login
                  </Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600 animate-slide-up">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}