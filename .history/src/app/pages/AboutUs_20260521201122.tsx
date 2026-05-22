import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Activity, 
  Wifi, 
  TrendingUp, 
  BarChart3, 
  Bell
} from 'lucide-react';

export default function About() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    // Staggered animation for steps
    const timeouts: NodeJS.Timeout[] = [];
    [0, 1, 2, 3, 4].forEach((index) => {
      const timeout = setTimeout(() => {
        setVisibleSteps((prev) => [...prev, index]);
      }, index * 300); // 300ms delay between each
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const flowSteps = [
    {
      icon: Activity,
      title: 'Capture Data',
      description: 'Sensors continuously collect environmental data including water levels, temperature, humidity, air pressure, and rainfall intensity',
      elaboration: 'The HydriX system begins with real-time data acquisition through multiple sensors deployed in strategic locations. The ultrasonic sensor measures water level by emitting sound waves and calculating distance based on echo return time. The BME680 environmental sensor simultaneously monitors temperature, humidity, and atmospheric pressure. The rainfall sensor detects precipitation intensity. All sensors operate continuously, taking readings at configured intervals (typically every 5-30 seconds) to ensure no critical changes are missed.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Wifi,
      title: 'Transmit Data',
      description: 'ESP32 microcontroller transmits collected data wirelessly to the cloud platform in real-time',
      elaboration: 'Once data is captured, the ESP32 microcontroller processes the raw sensor readings and packages them into structured data formats. Using its built-in Wi-Fi capabilities, the ESP32 establishes a secure connection to the cloud platform (such as ThingsBoard or custom server). Data is transmitted using MQTT or HTTP protocols with timestamps and sensor identifiers. The system includes retry logic to handle temporary network interruptions, buffering data locally until connection is restored.',
      color: 'from-blue-600 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Process Data',
      description: 'Cloud servers process and analyze the incoming data, comparing values against configured thresholds',
      elaboration: 'The cloud platform receives incoming sensor data and stores it in a time-series database for historical tracking. The system applies data validation to filter out erroneous readings caused by sensor noise or interference. Advanced processing algorithms compare current readings against user-configured thresholds (normal, warning, critical levels). The system also performs trend analysis, detecting rapid changes that might indicate imminent flooding even if thresholds haven\'t been exceeded. Machine learning models can predict flood probability based on historical patterns.',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: BarChart3,
      title: 'Visualize Data',
      description: 'Processed data is displayed on intuitive dashboards with charts, graphs, and real-time indicators',
      elaboration: 'The visualization layer transforms raw data into actionable insights through interactive dashboards. Users can view real-time gauges showing current sensor readings, line charts displaying historical trends, and color-coded status indicators (green/yellow/red) for quick assessment. The dashboard automatically updates as new data arrives, providing a live view of environmental conditions. Users can customize their view, set time ranges for historical analysis, and export data for reporting purposes.',
      color: 'from-cyan-600 to-blue-500'
    },
    {
      icon: Bell,
      title: 'Decision Making',
      description: 'System triggers alerts and notifications when critical thresholds are exceeded, enabling quick response',
      elaboration: 'When the system detects threshold violations or dangerous trends, it immediately initiates the alert protocol. Multiple notification channels are activated simultaneously: email alerts are sent to subscribed users, visual warnings appear on the dashboard, local buzzers sound at the sensor location, and LED indicators change color. The alert includes specific information about which sensor triggered the alarm, current values, and recommended actions. Admin users receive additional notifications with options to acknowledge alerts and update system status. All alerts are logged for audit trails and pattern analysis.',
      color: 'from-blue-500 to-blue-600'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-24 animate-fade-in">
        <div className="container mx-auto px-4 animate-slide-up">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* LEFT SECTION - Floating Question Marks */}
        <div className="relative flex justify-center items-center min-h-[300px]">

          {/* Glow background */}
          <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />

          {/* Big main question mark */}
          <div className="text-[200px] md:text-[240px] font-bold text-white select-none">
            ?
          </div>

          {/* ORBITING MINI QUESTION MARKS (ENLARGED + CLOSER) */}

          <div className="absolute -top-6 -left-6 text-7xl text-white/80 animate-[float_6s_ease-in-out_infinite]">
            ?
          </div>

          <div className="absolute -top-4 -right-8 text-6xl text-white/70 animate-[float_7s_ease-in-out_infinite]">
            ?
          </div>

          <div className="absolute -bottom-6 -left-6 text-7xl text-white/60 animate-[float_5.5s_ease-in-out_infinite]">
            ?
          </div>

          <div className="absolute -bottom-4 -right-8 text-8xl text-white/80 animate-[float_6.5s_ease-in-out_infinite]">
            ?
          </div>

          <div className="absolute top-1/2 -left-10 -translate-y-1/2 text-5xl text-white/50 animate-[float_8s_ease-in-out_infinite]">
            ?
          </div>

        </div>

            {/* RIGHT SECTION - Hero Content */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                What is HydriX ?
              </h1>

              <p className="text-xl text-blue-100 leading-relaxed">
                An advanced IoT-based flood detection system designed to provide early warnings
                and real-time monitoring to protect communities from flood disasters.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works Preview */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16 animate-slide-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">How HydriX Works</h2>
          </div>

          <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
            { icon: Activity, title: 'Capture Data', color: 'from-blue-500 to-blue-600' },
            { icon: Wifi, title: 'Transmit Data', color: 'from-blue-600 to-cyan-500' },
            { icon: TrendingUp, title: 'Process Data', color: 'from-cyan-500 to-cyan-600' },
            { icon: BarChart3, title: 'Visualize Data', color: 'from-cyan-600 to-blue-500' },
            { icon: Bell, title: 'Decision Making', color: 'from-blue-500 to-blue-600' }
          ].map((step, index) => {
            const Icon = step.icon;
            const isVisible = visibleSteps.includes(index);
            return (
              <div 
                key={index} 
                className={`text-center transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
          
                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg ${
                  isVisible ? 'scale-100' : 'scale-0'
                } transition-transform duration-500`}>
                  <Icon className="text-white" size={28} />
                </div>

                {/* Step Number */}
                <div className="text-sm font-semibold text-blue-500 mb-1">
                  Step {index + 1}
                </div>
          
                <h3 className="font-semibold text-blue-900">{step.title}</h3>
              </div>
            );
          })}
          </div>
        </div>
      </section>
      
      {/* How HydriX System Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-12 max-w-5xl mx-auto">
          {flowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index}
                className="border-blue-100 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-8">
                  {/* Header with Icon */}
                  <div className="flex items-start gap-6 mb-6">
                    <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          Step {index + 1}
                        </span>
                        <h3 className="text-2xl font-bold text-blue-900">{step.title}</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed font-medium">{step.description}</p>
                    </div>
                  </div>

                  {/* Elaboration */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-100">
                    <h4 className="font-semibold text-blue-900 mb-3">Detailed Process:</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {step.elaboration}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 border-none text-white">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Why Choose HydriX?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Early Warning System</h4>
                      <p className="text-blue-100 text-sm">Detect potential floods before they occur with predictive analytics</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">24/7 Monitoring</h4>
                      <p className="text-blue-100 text-sm">Continuous surveillance without interruption or human intervention</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Cost-Effective</h4>
                      <p className="text-blue-100 text-sm">Affordable solution using open-source IoT technology</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Easy Deployment</h4>
                      <p className="text-blue-100 text-sm">Simple setup and installation with modular components</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}