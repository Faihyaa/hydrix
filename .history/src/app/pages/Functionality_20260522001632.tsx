import { useEffect, useState } from 'react';

export default function Functionality() {
  const [active, setActive] = useState(0);

  const systemFlow = [
    {
      title: 'Environmental Sensing Layer',
      desc:
        'Core sensors detect water level, rainfall, temperature, humidity, and air pressure in real-time.',
      items: ['ESP32', 'BME680 Sensor', 'Ultrasonic Sensor', 'Rainfall Sensor'],
    },
    {
      title: 'Edge Processing Layer',
      desc:
        'ESP32 acts as the central brain, collecting and preparing data for transmission.',
      items: ['NodeMCU V3 Base Board', 'Micro USB Connection'],
    },
    {
      title: 'Cloud Communication Layer',
      desc:
        'Data is transmitted securely via Azure into ThingsBoard for real-time processing.',
      items: ['ESP32 WiFi Module', 'Azure Bridge', 'ThingsBoard IoT'],
    },
    {
      title: 'Data Storage Layer',
      desc:
        'Processed data is synchronized and stored in Firebase for live system access.',
      items: ['Firebase Realtime Database'],
    },
    {
      title: 'Visualization & Alert Layer',
      desc:
        'Dashboard displays live readings and triggers alerts using LED indicators and buzzer systems.',
      items: ['Dashboard UI', 'LED Indicators', 'Buzzer System', 'Powerbank Deployment'],
    },
  ];

  const coreSensors = [
    {
      name: 'ESP32',
      image:
        'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcSTvSadrXHVw7u_IRgTC8vUBkMeaaD9p77Lt_mSp0NzNdzM13Xptx5r2XjilKkcmkuybSw3mweMg5_IkYk',
    },
    {
      name: 'BME680',
      image:
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTKxVX288nwiWd1gDWOUP4UobD7wdfOlW3pI63JQz1guKHyqkSbvYgdpLD-Z3Gh8rF8AK4jP266pc2iOvo',
    },
    {
      name: 'Ultrasonic',
      image:
        'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQLald-qL171-sFED6Uxa_EcbX06ieLHoeYZz0jHDX60pZ72ttGzKrLn3n6s55uhFFvxOZ3kGCjpALniDo',
    },
    {
      name: 'Rain Sensor',
      image:
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcThY4dIYPWmg0qtoXRFh_MDMp96tzJJjDibdm7hVknfQvpW6YxmgtRWs4QPUSeX5EJIbjlrh_jpLbYIo-Q',
    },
  ];

  const supporting = [
    'NodeMCU V3 Base Board',
    'Breadboard',
    '4-in-1 Display',
    'LED Indicators',
    'Micro USB Cable',
    'Buzzer',
    'Powerbank',
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionHeight = window.innerHeight * 0.7;
      const index = Math.min(
        systemFlow.length - 1,
        Math.floor(window.scrollY / sectionHeight)
      );
      setActive(index);
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

        <div className="text-center px-6 z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            System <span className="text-cyan-400">Architecture</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            A scroll-driven breakdown of how HydriX transforms environmental data into intelligent flood alerts.
          </p>
        </div>
      </section>

      {/* SCROLL SYSTEM */}
      <section className="relative">

        <div className="sticky top-0 h-screen flex items-center px-8">
          <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

            {/* LEFT FLOW */}
            <div className="relative">

              <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-white/10"></div>
              <div
                className="absolute left-6 top-0 w-[2px] bg-gradient-to-b from-cyan-400 to-blue-500 transition-all duration-500"
                style={{
                  height: `${((active + 1) / systemFlow.length) * 100}%`,
                }}
              ></div>

              <div className="space-y-14">

                {systemFlow.map((step, i) => {
                  const isActive = i === active;

                  return (
                    <div key={i} className="flex gap-6 items-start">

                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
                          isActive
                            ? 'bg-cyan-400 text-black shadow-[0_0_25px_rgba(34,211,238,0.7)] scale-110'
                            : 'bg-slate-900 border-white/20 text-white/60'
                        }`}
                      >
                        {i + 1}
                      </div>

                      <div>
                        <h3
                          className={`font-semibold transition ${
                            isActive ? 'text-cyan-300' : 'text-white/60'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-400 max-w-sm">
                          {step.desc}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {step.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-full text-slate-300"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT DETAIL PANEL */}
            <div className="hidden lg:block">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">

                <h2 className="text-sm text-cyan-400 mb-3">
                  ACTIVE LAYER
                </h2>

                <h1 className="text-3xl font-bold mb-4">
                  {systemFlow[active].title}
                </h1>

                <p className="text-slate-300 mb-6">
                  {systemFlow[active].desc}
                </p>

                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                    style={{
                      width: `${((active + 1) / systemFlow.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="mt-10">
                  <h3 className="text-cyan-300 mb-4">
                    Core Components In This Layer
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {coreSensors.map((s, i) => (
                      <div
                        key={i}
                        className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center"
                      >
                        <img
                          src={s.image}
                          className="w-16 h-16 mx-auto object-contain"
                        />
                        <p className="text-sm mt-2">{s.name}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-cyan-300 mb-2">
                      Supporting Components
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {supporting.map((item, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-full text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* scroll height */}
        <div className="h-[350vh]" />
      </section>

      {/* END */}
      <section className="py-32 text-center bg-slate-950">
        <h2 className="text-4xl font-bold mb-4">
          From Hardware → Cloud → Intelligence
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          A fully integrated IoT ecosystem designed for real-time flood detection and response.
        </p>
      </section>
    </div>
  );
}