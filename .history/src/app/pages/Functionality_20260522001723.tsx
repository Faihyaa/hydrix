import { Card, CardContent } from '../components/ui/card';

export default function Functionality() {
  const coreSensors = [
    {
      name: 'ESP32',
      description:
        'Powerful microcontroller with Wi-Fi and Bluetooth for data processing and transmission.',
      specs: 'Range (Wi-Fi): 50–100 m, Range (Bluetooth): 10 m',
      image:
        'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcSTvSadrXHVw7u_IRgTC8vUBkMeaaD9p77Lt_mSp0NzNdzM13Xptx5r2XjilKkcmkuybSw3mweMg5_IkYk',
      details: [
        'Stable 3.3V operation',
        'Supports Wi-Fi and Bluetooth communication',
        'Fast processing with dual-core CPU',
      ],
    },
    {
      name: 'BME680 Sensor',
      description:
        'Environmental sensor for temperature, humidity, and air pressure.',
      specs: 'Temperature: ±1 °C, Humidity: ±3 %, Pressure: ±1 hPa',
      image:
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTKxVX288nwiWd1gDWOUP4UobD7wdfOlW3pI63JQz1guKHyqkSbvYgdpLD-Z3Gh8rF8AK4jP266pc2iOvo',
      details: [
        'Tracks temperature and humidity',
        'Monitors air pressure',
        'Customizable thresholds',
      ],
    },
    {
      name: 'Ultrasonic Sensor (HC-SR04P)',
      description: 'Measures water level distance without contact.',
      specs: 'Range: 2–400cm, Accuracy: ±3mm',
      image:
        'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQLald-qL171-sFED6Uxa_EcbX06ieLHoeYZz0jHDX60pZ72ttGzKrLn3n6s55uhFFvxOZ3kGCjpALniDo',
      details: [
        'Non-contact water level detection',
        'Uses sound wave reflection',
        'Reliable flood level measurement',
      ],
    },
    {
      name: 'Rainfall Sensor',
      description: 'Measures rainfall intensity.',
      specs: 'Range: 0–200 mm/h, Accuracy: ±5 %',
      image:
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcThY4dIYPWmg0qtoXRFh_MDMp96tzJJjDibdm7hVknfQvpW6YxmgtRWs4QPUSeX5EJIbjlrh_jpLbYIo-Q',
      details: [
        'Detects rainfall intensity',
        'Triggers early rain detection alerts',
        'Customizable thresholds',
      ],
    },
  ];

  const supportingComponents = [
    {
      name: 'NodeMCU V3 Base Board',
      desc: 'ESP32 development board with USB interface.',
      image:
        'https://admin.robotedu.my/image/robotedu/image/data/all_product_images/product-192/gelck27k1753781601.jpg',
      details: [
        'USB programming interface',
        'Stable power regulation',
        'Breadboard compatibility',
      ],
    },
    {
      name: 'Small Breadboard',
      desc: 'Board for building circuits without wiring.',
      image:
        'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcRlz_xTSNyhWUnrJaezCoHibk9KooLCYXTyvyaI2lpkZbT3H4LibsCxnyAQxfQS4OGPvy1SU6AakmCC97I',
      details: [
        'Clean circuit prototyping',
        'Reusable connections',
        'Efficient wiring layout',
      ],
    },
    {
      name: '4-in-1 Dot Matrix Display',
      desc: 'Visual display for real-time measurements.',
      image:
        'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcT5pl0w1MHFiBNeoTpxinYXmRASgBP9nL3JQ52mIWuDqr2LbXzPEVEKwviWauPEvJU3G4xnMjpl4WvYOkQ',
      details: ['Displays live sensor values', 'Clear distance visibility'],
    },
    {
      name: 'LED Indicators',
      desc: 'Visual status indicators (green/yellow/red).',
      image:
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQOMmXCh4-hKM9-FWJ6a6GpD26gcZCTCrnkI45hbwoqHHjGCcMXfJJHayfJoFX3hSzukGhGZkFpa0eP528',
      details: ['Green: Normal', 'Yellow: Warning', 'Red: Critical alert'],
    },
    {
      name: 'Micro USB B Cable',
      desc: 'Power and data connection for ESP32.',
      image:
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSKSIdw7RX8yOzaMmuJzYhVLi3psnF8g_p_unpMIOAW7STmDXXJd9aF6QjTNvF5MpX_V4sWKiCuyaymnqs',
      details: ['Power supply', 'Data transfer', 'Firmware upload'],
    },
    {
      name: 'Buzzer (Active)',
      desc: 'Audio alert for warnings and alarms.',
      image:
        'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRIsXSHeZJ4JUVCphKqiS8F-VDTipH6eiI9fjzcNU0yMuJV-NFH1-sYzmOqSs0EhRnZnNZ7McgWsj-cmIw',
      details: ['Audible flood warning system'],
    },
    {
      name: 'Powerbank (10000mAh+)',
      desc: 'Portable power supply for field deployment.',
      image:
        'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQSbSRFuHAweazyFCC4KilXEx4gY6Z4EJqgOwCQ9_6rgMAEmLdQquJNEjWGvf_apKCoFBFE9lrf9dzua24',
      details: ['Portable power source', 'Field deployment ready'],
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 text-white py-28">
        <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 blur-3xl rounded-full"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4">
            System <span className="text-cyan-400">Functionality</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Smart IoT components working together for accurate, real-time flood detection and alerting.
          </p>
        </div>
      </section>

      {/* CORE SENSORS */}
      <section className="py-24 bg-slate-950">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-3">
            Core <span className="text-cyan-400">Sensors</span>
          </h2>
        </div>

        <div className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {coreSensors.map((sensor, index) => (
            <div
              key={index}
              className="group bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-300"
            >
              <div className="flex gap-6 items-start">
                <div className="w-28 h-28 flex-shrink-0 bg-white rounded-2xl overflow-hidden">
                  <img
                    src={sensor.image}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300">
                    {sensor.name}
                  </h3>
                  <p className="text-cyan-300 text-sm mt-1">{sensor.specs}</p>
                  <p className="text-slate-300 text-sm mt-2">
                    {sensor.description}
                  </p>

                  <ul className="mt-4 space-y-1 text-sm text-slate-400">
                    {sensor.details.map((d, i) => (
                      <li key={i}>• {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORTING COMPONENTS */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-3">
            Supporting <span className="text-cyan-400">Components</span>
          </h2>
        </div>

        <div className="container mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportingComponents.map((c, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:border-blue-400/40 transition-all duration-300"
            >
              <div className="w-full h-40 bg-white rounded-2xl overflow-hidden mb-4">
                <img
                  src={c.image}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              <h3 className="text-lg font-semibold text-white">
                {c.name}
              </h3>
              <p className="text-slate-400 text-sm mt-1">{c.desc}</p>

              <ul className="mt-3 text-sm text-slate-400 space-y-1">
                {c.details.map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}