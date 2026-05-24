import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Wifi,
  Activity,
  Bell,
  BarChart3,
  Smartphone,
  Shield,
  AlertTriangle,
  Calendar
} from 'lucide-react';

export default function Home() {
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

    // 24 counter
    const hourInterval = setInterval(() => {
      setHourCount((prev) => {
        if (prev < 24) return prev + 1;
        return prev;
      });
    }, 30);

    // Instant fade-in
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
      description:
        'Seamless connection with ESP32 and multiple sensors for comprehensive data collection.'
    },
    {
      icon: Activity,
      title: 'Real-Time Data Monitoring',
      description:
        'Continuous monitoring of water levels, temperature, humidity, air pressure, and rainfall intensity.'
    },
    {
      icon: Bell,
      title: 'Real-Time Alert Notifications',
      description:
        'Instant email alerts when critical thresholds are reached to enable quick response.'
    },
    {
      icon: BarChart3,
      title: 'Data Analysis',
      description:
        'Advanced analytics to identify patterns and predict potential flood risks.'
    },
    {
      icon: Smartphone,
      title: 'User-Friendly Interface',
      description:
        'Clean and intuitive dashboard design for easy monitoring and management.'
    },
    {
      icon: Shield,
      title: 'Accessible Across Multiple Devices',
      description:
        'Access flood monitoring system from any device, anytime, anywhere!'
    }
  ];

  const floodHistory = [
    {
      date: '2023-12-15',
      title: 'Major Flood Alert - Riverside District',
      description:
        'Water level reached critical threshold. Emergency response activated within 10 minutes. No casualties reported.',
      severity: 'high',
      image:
        'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400'
    },
    {
      date: '2024-03-22',
      title: 'Flash Flood Warning - Downtown Area',
      description:
        'Heavy rainfall caused sudden water rise. System detected anomaly 45 minutes before flood. Residents evacuated safely.',
      severity: 'medium',
      image:
        'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400'
    },
    {
      date: '2024-08-09',
      title: 'Monsoon Season - Early Detection Success',
      description:
        'Continuous monitoring during monsoon season prevented potential disaster. Early warnings issued 2 hours in advance.',
      severity: 'low',
      image:
        'https://images.unsplash.com/photo-1520483601560-6fa20e8c5ce3?w=400'
    }
  ];

return (
  <div className="min-h-screen bg-white">

    {/* Hero + Stats Section */}
    <section className="container mx-auto px-4 py-16 max-w-7xl overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Hero Content */}
        <div className="animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight text-left">
            Protect Your Community with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              HydriX
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed text-left">
            Advanced early flood detection system powered by IoT technology.
            Monitor environmental conditions in real-time and receive instant
            alerts to prevent disasters before they happen.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard">
              <Button
                size="lg"
                className="w-48 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-lg px-8"
              >
                View Dashboard
              </Button>
            </Link>

            <Link to="/about">
              <Button
                size="lg"
                variant="outline"
                className="w-48 text-lg px-8 border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Stats Bubbles */}
        <div className="relative flex justify-center items-center min-h-[460px]">

          <div className="relative w-[380px] h-[460px]">

            {/* Decorative Bubbles */}
            <div className="absolute inset-0 pointer-events-none">

              <div className="absolute top-8 left-10 w-10 h-10 bg-blue-200/70 rounded-full shadow-md animate-[float_6s_ease-in-out_infinite]" />
              <div className="absolute top-12 right-8 w-12 h-12 bg-cyan-200/70 rounded-full shadow-md animate-[float_7s_ease-in-out_infinite]" />
              <div className="absolute top-1/2 left-0 w-9 h-9 bg-blue-300/60 rounded-full shadow-md animate-[float_5.5s_ease-in-out_infinite]" />
              <div className="absolute top-1/2 right-0 w-10 h-10 bg-cyan-300/60 rounded-full shadow-md animate-[float_6.5s_ease-in-out_infinite]" />
              <div className="absolute bottom-12 left-14 w-11 h-11 bg-blue-200/70 rounded-full shadow-md animate-[float_6.8s_ease-in-out_infinite]" />
              <div className="absolute bottom-10 right-16 w-10 h-10 bg-cyan-200/70 rounded-full shadow-md animate-[float_7.2s_ease-in-out_infinite]" />

            </div>

            {/* Bubble 1 */}
            <div className="absolute top-0 left-4 w-44 h-44 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-2xl flex flex-col items-center justify-center animate-[float_6s_ease-in-out_infinite]">
              <div className="text-4xl font-bold">{hourCount}/24</div>
              <div className="text-center text-sm mt-2 px-3">
                Real-Time Monitoring
              </div>
            </div>

            {/* Bubble 2 */}
            <div className="absolute top-32 right-0 w-52 h-52 rounded-full bg-gradient-to-br from-red-500 to-orange-400 text-white shadow-2xl flex flex-col items-center justify-center animate-[float_8s_ease-in-out_infinite]">
              <div
                className="text-4xl font-bold transition-opacity duration-1000"
                style={{ opacity: instantOpacity }}
              >
                Instant
              </div>
              <div className="text-center text-sm mt-2 px-4">
                Alert Notifications
              </div>
            </div>

            {/* Bubble 3 */}
            <div className="absolute bottom-0 left-24 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-600 to-teal-400 text-white shadow-2xl flex flex-col items-center justify-center animate-[float_7s_ease-in-out_infinite]">
              <div className="text-4xl font-bold">{count}%</div>
              <div className="text-center text-sm mt-2 px-3">
                Cloud Connected
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

    {/* Flood History Bulletin */}
    <section className="container mx-auto px-4 py-16 max-w-7xl bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl">