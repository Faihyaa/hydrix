import { Link } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Droplets, Home } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />
      <Card className="max-w-md w-full border-blue-200 shadow-lg relative z-10 animate-fade-in">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Droplets className="text-white" size={40} />
          </div>
          <h1 className="text-6xl font-bold text-blue-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-blue-800 mb-3">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Home size={18} className="mr-2" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}