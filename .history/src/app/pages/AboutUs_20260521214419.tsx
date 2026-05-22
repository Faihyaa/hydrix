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
      <section className="container mx-auto px-4 py-14 max-w-7xl overflow-hidden">
        <div className="container mx-auto px-4 py-15 items-center animate-slide-up">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* LEFT SECTION - Floating Question Marks */}
            <div className="relative flex justify-center items-center min-h-[300px]">

              {/* Glow background */}
              <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

              {/* Big main question mark */}
              <div className="text-[300px] md:text-[220px] font-bold text-blue-500 animate-[float_3s_ease-in-out_infinite]">
                ?
              </div>

              {/* Floating question marks (ENLARGED) */}
              <div className="absolute top-2 left-30 text-7xl text-blue-500/80 animate-[float_6s_ease-in-out_infinite]">
                ?
              </div>

              <div className="absolute top-16 right-30 text-5xl text-blue-500/60 animate-[float_7s_ease-in-out_infinite]">
                ?
              </div>

              <div className="absolute bottom-14 left-14 text-6xl text-blue-500/40 animate-[float_5.5s_ease-in-out_infinite]">
                ?
              </div>

              <div className="absolute bottom-10 right-10 text-7xl text-blue-500/70 animate-[float_6.5s_ease-in-out_infinite]">
                ?
              </div>

              <div className="absolute top-1/2 left-0 text-4xl text-blue-500/50 animate-[float_8s_ease-in-out_infinite]">
                ?
              </div>

            </div>

            {/* RIGHT SECTION - Hero Content */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl text-blue-900 font-bold mb-6">
                What is HydriX ?
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                An advanced IoT-based flood detection system designed to provide early warnings
                and real-time monitoring to protect communities from flood disasters.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works Section - Modern Timeline Layout */}
<section className="bg-white py-20">
  <div className="container mx-auto px-4">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
        How HydriX Works
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        A seamless five-step process to detect and prevent flood disasters
      </p>
    </div>

    {/* Timeline Container */}
    <div className="max-w-5xl mx-auto">
      {[
        {
          step: 1,
          icon: Activity,
          title: 'Collect Environmental Data',
          color: 'from-blue-500 to-blue-600',
          description: 'Sensors monitor environmental conditions such as water level, temperature, humidity, and rainfall intensity in real-time.',
          align: 'left'
        },
        {
          step: 2,
          icon: Wifi,
          title: 'Transmit Data to ESP32',
          color: 'from-blue-600 to-cyan-500',
          description: 'The collected sensor data is transmitted to the ESP32 microcontroller for wireless communication and processing.',
          align: 'right'
        },
        {
          step: 3,
          icon: TrendingUp,
          title: 'Send Data to the Cloud',
          color: 'from-cyan-500 to-cyan-600',
          description: 'The ESP32 sends sensor data to ThingsBoard through Microsoft Azure to allow secure and real-time cloud communication.',
          align: 'left'
        },
        {
          step: 4,
          icon: BarChart3,
          title: 'Store Data in Firebase',
          color: 'from-cyan-600 to-blue-500',
          description: 'The cloud system stores and synchronizes the processed data in Firebase to support live monitoring and website integration.',
          align: 'right'
        },
        {
          step: 5,
          icon: Bell,
          title: 'Visualize Data & Trigger Alerts',
          color: 'from-blue-500 to-blue-600',
          description: 'The website displays real-time environmental data, visual analytics, and instant alert notifications when flood risk levels become dangerous.',
          align: 'left'
        }
      ].map((item, index) => {
        const Icon = item.icon;
        const isLeftAligned = item.align === 'left';

        return (
          <div key={index} className="mb-12 md:mb-16">
            {/* Timeline Row */}
            <div className={`grid md:grid-cols-2 gap-8 items-center ${!isLeftAligned && 'md:[direction:rtl]'}`}>
              
              {/* Content Card */}
              <div className={`${!isLeftAligned && 'md:[direction:ltr]'}`}>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
                  {/* Step Number Badge */}
                  <div className="inline-block mb-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full font-bold text-sm">
                      {item.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-blue-900 mb-3">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bubble Icon */}
              <div className={`flex justify-center ${!isLeftAligned && 'md:order-first'}`}>
                <div className="relative">
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-full blur-2xl opacity-20 animate-pulse`} />
                  
                  {/* Bubble */}
                  <div className={`relative w-32 h-32 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={56} />
                  </div>

                  {/* Connector Line (except for last item) */}
                  {index < 4 && (
                    <div className="hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-blue-400 to-cyan-400" />
                  )}
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>

    {/* Bottom CTA */}
    <div className="text-center mt-16">
      <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
        Explore the IoT Dashboard
      </button>
    </div>
  </div>
</section>
    </>
  );
}