import { Layout } from '../components/Layout';
import { PublicLayout } from '../components/PublicLayout';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { 
  Wifi, 
  Activity, 
  Bell, 
  BarChart3, 
  Smartphone, 
  Shield,
  Droplets
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [hourCount, setHourCount] = useState(0);
  const [instantOpacity, setInstantOpacity] = useState(0);

  useEffect(() => {
    // 100% counter
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev < 100) return prev + 1;
        return prev;
      });
    }, 15);

    // 24/7 counter
    const hourInterval = setInterval(() => {
      setHourCount((prev) => {
        if (prev < 24) return prev + 1;
        return prev;
      });
    }, 30);

    // Instant fade-in animation
    const instantTimeout = setTimeout(() => {
      setInstantOpacity(1);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(hourInterval);
      clearTimeout(instantTimeout);
    };
  }, []);

  const features = [
    {
      icon: Wifi,
      title: 'IoT Integration',
      description: 'Seamless connection with ESP32 and multiple sensors for comprehensive data collection.'
    },
    {
      icon: Activity,
      title: 'Real-Time Data Monitoring',
      description: 'Continuous monitoring of water levels, temperature, humidity, air pressure, and rainfall intensity.'
    },
    {
      icon: Bell,
      title: 'Real-Time Alert Notifications',
      description: 'Instant email alerts when critical thresholds are reached to enable quick response.'
    },
    {
      icon: BarChart3,
      title: 'Data Analysis',
      description: 'Advanced analytics to identify patterns and predict potential flood risks.'
    },
    {
      icon: Smartphone,
      title: 'User-Friendly Interface',
      description: 'Clean and intuitive dashboard design for easy monitoring and management.'
    },
    {
      icon: Shield,
      title: 'Accessible Across Multiple Devices',
      description: 'Access flood monitoring system from any device, anytime, anywhere!'
    }
  ];

  const floodHistory = [
    {
      date: '2023-12-15',
      title: 'Major Flood Alert - Riverside District',
      description: 'Water level reached critical threshold. Emergency response activated within 10 minutes. No casualties reported.',
      severity: 'high',
      image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400'
    },
    {
      date: '2024-03-22',
      title: 'Flash Flood Warning - Downtown Area',
      description: 'Heavy rainfall caused sudden water rise. System detected anomaly 45 minutes before flood. Residents evacuated safely.',
      severity: 'medium',
      image: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400'
    },
    {
      date: '2024-08-09',
      title: 'Monsoon Season - Early Detection Success',
      description: 'Continuous monitoring during monsoon season prevented potential disaster. Early warnings issued 2 hours in advance.',
      severity: 'low',
      image: 'https://images.unsplash.com/photo-1520483601560-6fa20e8c5ce3?w=400'
    }
  ];

  const LayoutComponent = user ? Layout : PublicLayout;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 animate-fade-in max-w-7xl">
        <div className="text-center max-w-4xl mx-auto animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight">
            Protect Your Community with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              HydriX
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Advanced early flood detection system powered by IoT technology. Monitor environmental conditions 
            in real-time and receive instant alerts to prevent disasters before they happen.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                View Dashboard
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-lg px-8 border-blue-300 text-blue-700 hover:bg-blue-50">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 py-12 animate-slide-up">
        <div className="container mx-auto px-3 max-w-7xl">
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-white text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{hourCount}/7</div>
              <div className="text-blue-100">Real-Time Monitoring</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 transition-opacity duration-1000" style={{ opacity: instantOpacity }}>Instant</div>
              <div className="text-blue-100">Alert Notifications</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{count}%</div>
              <div className="text-blue-100">Cloud Connected</div>
            </div>
          </div>
        </div>
      </section>

{/* Flood History Bulletin */}
      <section className="container mx-auto px-4 py-16 max-w-7xl bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Flood Detection History</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real success stories from our flood detection system - lives saved and disasters prevented
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {floodHistory.map((event, index) => (
            <Card
              key={index}
              className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                event.severity === 'high' ? 'border-red-300' :
                event.severity === 'medium' ? 'border-orange-300' :
                'border-blue-300'
              }`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                  event.severity === 'high' ? 'bg-red-500' :
                  event.severity === 'medium' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`}>
                  {event.severity === 'high' ? 'Critical' :
                   event.severity === 'medium' ? 'Warning' :
                   'Advisory'}
                </div>
              </div>

              <CardHeader>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Calendar size={16} />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <CardTitle className="text-lg text-blue-900 flex items-start gap-2">
                  <AlertTriangle size={20} className="flex-shrink-0 mt-1" />
                  <span>{event.title}</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {event.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Key Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive flood detection capabilities designed to keep you informed and prepared
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white text-center"
              >
                <CardHeader className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-white" size={24} />
                  </div>
                  <CardTitle className="text-xl text-blue-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 border-none text-white">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Monitoring?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Access our IoT dashboard and start tracking environmental conditions in real-time!
            </p>
            <Link to="/dashboard" className="mb-8">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
                Access Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}