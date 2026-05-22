import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
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

  return (
    <div className="min-h-screen relative">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-21 max-w-7xl overflow-hidden">
        <div className="container mx-auto px-4 py-20 max-w-7xl">
          {/* Subtle background decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-20 left-0 w-80 h-80 bg-cyan-100/30 rounded-full blur-3xl -z-10" />

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* LEFT SECTION - Floating Question Marks */}
            <div className="relative flex justify-center items-center min-h-[300px]">
              {/* Glow background */}
              <div className="absolute w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />

              {/* Big main question mark */}
              <div className="text-[250px] md:text-[200px] font-bold text-blue-500 animate-[float_3s_ease-in-out_infinite]">
                ?
              </div>

              {/* Floating question marks */}
              <div className="absolute top-2 left-30 text-7xl text-blue-400/70 animate-[float_6s_ease-in-out_infinite]">
                ?
              </div>

              <div className="absolute top-16 right-30 text-5xl text-cyan-400/60 animate-[float_7s_ease-in-out_infinite]">
                ?
              </div>

              <div className="absolute bottom-14 left-14 text-6xl text-blue-300/50 animate-[float_5.5s_ease-in-out_infinite]">
                ?
              </div>

              <div className="absolute bottom-10 right-10 text-7xl text-cyan-400/60 animate-[float_6.5s_ease-in-out_infinite]">
                ?
              </div>

              <div className="absolute top-1/2 left-0 text-4xl text-blue-300/40 animate-[float_8s_ease-in-out_infinite]">
                ?
              </div>
            </div>

            {/* RIGHT SECTION - Hero Content */}
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl text-blue-900 font-bold mb-6 leading-tight">
                What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">HydriX</span> ?
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                HydriX is a smart flood detection and monitoring system that uses environmental sensors, 
                cloud technology, and real-time data analysis to detect potential flood risks.
              </p>

              <div className="flex gap-4">
                <a href="#features">
                  <Button className="w-40 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-lg px-8">
                    Learn More
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" className="scroll-mt-30">
        {/* Decorative elements */}
        <div className="absolute top-10 left-5 w-32 h-32 bg-blue-100/40 rounded-full blur-2xl -z-10" />
        <div className="absolute bottom-0 right-10 w-40 h-40 bg-cyan-100/30 rounded-full blur-2xl -z-10" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Heading */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-blue-900 mb-4">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">HydriX</span> Works ?
            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              HydriX combines IoT sensors, cloud computing, and real-time analytics
              to monitor environmental conditions and provide instant flood alerts.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative max-w-5xl mx-auto">
            {/* Center Line - Light and subtle */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-blue-300 to-transparent -translate-x-1/2"></div>

            {[
              {
                icon: Activity,
                title: "Collect Environmental Data",
                description: "Sensors monitor environmental conditions such as water level, temperature, humidity, and rainfall intensity in real-time.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Wifi,
                title: "Transmit Data to ESP32",
                description: "The collected sensor data is transmitted to the ESP32 microcontroller for wireless communication and processing.",
                color: "from-cyan-500 to-blue-500",
              },
              {
                icon: TrendingUp,
                title: "Send Data to the Cloud",
                description: "The ESP32 sends sensor data to ThingsBoard through Microsoft Azure to allow secure and real-time cloud communication.",
                color: "from-blue-600 to-cyan-500",
              },
              {
                icon: BarChart3,
                title: "Store Data in Firebase",
                description: "The cloud system stores and synchronizes the processed data in Firebase to support live monitoring and website integration.",
                color: "from-cyan-500 to-blue-600",
              },
              {
                icon: Bell,
                title: "Visualize Data & Trigger Alerts",
                description: "The website displays real-time environmental data, visual analytics, and instant alert notifications when flood risk levels become dangerous.",
                color: "from-blue-500 to-cyan-500",
              },
            ].map((step, index) => {
              const Icon = step.icon;
              const isVisible = visibleSteps.includes(index);

              return (
                <div
                  key={index}
                  className={`relative mb-16 transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <div
                    className={`flex flex-col lg:flex-row items-center ${
                      index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    } gap-8 lg:gap-12`}
                  >
                    {/* Content Card */}
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 group">
                        {/* Step Number */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-5">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                          Step {index + 1}
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                          {step.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Bubble Icon */}
                    <div className="relative z-20 flex-shrink-0">
                      {/* Glow */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-full blur-2xl opacity-30 scale-125`}
                      ></div>

                      {/* Bubble */}
                      <div
                        className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg border border-white transition-all duration-500 flex-shrink-0 ${
                          isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
                        }`}
                      >
                        <Icon className="text-white" size={40} />
                      </div>
                    </div>

                    {/* Spacer for layout */}
                    <div className="hidden lg:block flex-1"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-blue-900 mb-4">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">HydriX</span>?
              </h2>
              <p className="text-lg text-gray-600">
                Discover the features that make HydriX the ideal solution for flood detection
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Early Warning System",
                  desc: "Detect potential floods before they occur with predictive analytics",
                  icon: "⚡",
                },
                {
                  title: "24/7 Monitoring",
                  desc: "Continuous surveillance without interruption or human intervention",
                  icon: "👁️",
                },
                {
                  title: "Cost-Effective",
                  desc: "Affordable solution using open-source IoT technology",
                  icon: "💰",
                },
                {
                  title: "Easy Deployment",
                  desc: "Simple setup and installation with modular components",
                  icon: "🚀",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-8 hover:shadow-md hover:border-blue-400 transition-all duration-300"
                >
                  <div className="flex gap-5 items-start">
                    <div className="text-4xl flex-shrink-0 transition-transform group-hover:scale-110">
                      {item.icon}
                    </div>

                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>

                      <p className="text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ div>
  );
}