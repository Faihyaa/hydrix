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

      {/* How It Works Section */}
<section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 py-24">
  
  {/* Background Glow */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>

  <div className="container mx-auto px-4 relative z-10">

    {/* Heading */}
    <div className="text-center mb-16">
      <p className="text-cyan-400 font-semibold tracking-widest uppercase mb-3">
        Intelligent Flood Monitoring Workflow
      </p>

      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        How <span className="text-cyan-400">HydriX</span> Works
      </h2>

      <p className="text-slate-300 max-w-2xl mx-auto">
        HydriX combines IoT sensors, cloud computing, and real-time analytics
        to monitor environmental conditions and provide instant flood alerts.
      </p>
    </div>

    {/* Timeline Layout */}
    <div className="relative max-w-6xl mx-auto">

      {/* Center Line */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500/30 via-blue-500/50 to-cyan-500/30 -translate-x-1/2"></div>

      {[
        {
          icon: Activity,
          title: "Collect Environmental Data",
          description:
            "Sensors monitor environmental conditions such as water level, temperature, humidity, and rainfall intensity in real-time.",
          color: "from-blue-500 to-cyan-500",
        },
        {
          icon: Wifi,
          title: "Transmit Data to ESP32",
          description:
            "The collected sensor data is transmitted to the ESP32 microcontroller for wireless communication and processing.",
          color: "from-cyan-500 to-blue-500",
        },
        {
          icon: Cloud,
          title: "Send Data to the Cloud",
          description:
            "The ESP32 sends sensor data to ThingsBoard through Microsoft Azure to allow secure and real-time cloud communication.",
          color: "from-blue-600 to-cyan-500",
        },
        {
          icon: Database,
          title: "Store Data in Firebase",
          description:
            "The cloud system stores and synchronizes the processed data in Firebase to support live monitoring and website integration.",
          color: "from-cyan-500 to-blue-600",
        },
        {
          icon: Bell,
          title: "Visualize Data & Trigger Alerts",
          description:
            "The website displays real-time environmental data, visual analytics, and instant alert notifications when flood risk levels become dangerous.",
          color: "from-blue-500 to-cyan-500",
        },
      ].map((step, index) => {
        const Icon = step.icon;
        const isVisible = visibleSteps.includes(index);

        return (
          <div
            key={index}
            className={`relative mb-12 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div
              className={`flex flex-col lg:flex-row items-center ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8`}
            >

              {/* Content Card */}
              <div className="flex-1">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl hover:border-cyan-400/40 transition-all duration-300 group">

                  {/* Step Number */}
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm font-semibold mb-5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    Step {index + 1}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Bubble Icon */}
              <div className="relative z-20 flex-shrink-0">

                {/* Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-full blur-2xl opacity-40 scale-125`}
                ></div>

                {/* Bubble */}
                <div
                  className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.35)] border border-white/20 transition-all duration-500 ${
                    isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
                  }`}
                >
                  <Icon className="text-white" size={38} />
                </div>
              </div>

              {/* Spacer */}
              <div className="hidden lg:block flex-1"></div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

{/* Benefits Section */}
<section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 border-none text-white shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Why Choose HydriX?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {[
              {
                title: "Early Warning System",
                desc: "Detect potential floods before they occur with predictive analytics",
              },
              {
                title: "24/7 Monitoring",
                desc: "Continuous surveillance without interruption or human intervention",
              },
              {
                title: "Cost-Effective",
                desc: "Affordable solution using open-source IoT technology",
              },
              {
                title: "Easy Deployment",
                desc: "Simple setup and installation with modular components",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-white/10 border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold">✓</span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-1">
                      {item.title}
                    </h4>

                    <p className="text-blue-100 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</section>
    </>
  );
}