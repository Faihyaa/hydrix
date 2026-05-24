import { useEffect, useState } from 'react';

export default function Functionality() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: 'Sensors Capture Environment',
      desc:
        'Water level, rainfall, temperature, and humidity are continuously measured in real-time.',
    },
    {
      title: 'ESP32 Processing Unit',
      desc:
        'All sensor data is collected and processed by the ESP32 microcontroller.',
    },
    {
      title: 'Cloud Transmission Layer',
      desc:
        'Data is securely sent through Azure into ThingsBoard for real-time cloud communication.',
    },
    {
      title: 'Firebase Sync Layer',
      desc:
        'Processed data is stored and synchronized in Firebase for live application access.',
    },
    {
      title: 'Dashboard & Alerts',
      desc:
        'The system visualizes data and triggers instant flood risk alerts on the website.',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sectionHeight = window.innerHeight;

      const index = Math.min(
        steps.length - 1,
        Math.floor(scrollY / (sectionHeight * 0.6))
      );

      setActiveStep(index);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-slate-950 text-white">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full top-10 left-10"></div>
        <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

        <div className="text-center z-10 px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            System <span className="text-cyan-400">Architecture</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            A scroll-driven visualization of how HydriX transforms raw sensor data into real-time flood intelligence.
          </p>
        </div>
      </section>

      {/* SCROLL SYSTEM DIAGRAM */}
      <section className="relative">

        {/* Sticky Left Pipeline */}
        <div className="sticky top-0 h-screen flex items-center px-10">
          <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT VISUAL PIPELINE */}
            <div className="relative">

              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-white/10"></div>
              <div
                className="absolute left-6 top-0 w-[2px] bg-gradient-to-b from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ height: `${((activeStep + 1) / steps.length) * 100}%` }}
              ></div>

              <div className="space-y-16">

                {steps.map((step, index) => {
                  const isActive = index === activeStep;

                  return (
                    <div key={index} className="flex items-start gap-6">

                      {/* Node */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${
                          isActive
                            ? 'bg-cyan-400 text-black scale-110 shadow-[0_0_25px_rgba(34,211,238,0.7)]'
                            : 'bg-slate-900 border-white/20 text-white'
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Label */}
                      <div>
                        <h3 className={`font-semibold transition-all ${
                          isActive ? 'text-cyan-300' : 'text-white/60'
                        }`}>
                          {step.title}
                        </h3>

                        <p className="text-sm text-slate-400 max-w-xs">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT DETAIL PANEL */}
            <div className="hidden lg:block">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl transition-all duration-500">

                <div className="text-cyan-400 text-sm mb-3">
                  ACTIVE STAGE
                </div>

                <h2 className="text-3xl font-bold mb-4">
                  {steps[activeStep].title}
                </h2>

                <p className="text-slate-300 leading-relaxed">
                  {steps[activeStep].desc}
                </p>

                <div className="mt-8 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                    style={{
                      width: `${((activeStep + 1) / steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Space */}
        <div className="h-[300vh]"></div>
      </section>

      {/* END SECTION */}
      <section className="py-32 text-center bg-gradient-to-br from-slate-950 to-blue-950">
        <h2 className="text-4xl font-bold mb-4">
          From Data → Intelligence → Action
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto">
          HydriX continuously transforms raw environmental signals into meaningful flood prevention insights.
        </p>
      </section>
    </div>
  );
}