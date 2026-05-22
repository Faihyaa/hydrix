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
        'Fast dual-core processing',
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
      specs: 'Range: 2–400 cm, Accuracy: ±3 mm',
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
        'Triggers early rain alerts',
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
      desc: 'Board for building circuits without soldering.',
      image:
        'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcRlz_xTSNyhWUnrJaezCoHibk9KooLCYXTyvyaI2lpkZbT3H4LibsCxnyAQxfQS4OGPvy1SU6AakmCC97I',
      details: [
        'Reusable prototyping',
        'Efficient wiring layout',
        'Clean circuit organization',
      ],
    },
    {
      name: '4-in-1 Dot Matrix Display',
      desc: 'Visual display for real-time measurements.',
      image:
        'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcT5pl0w1MHFiBNeoTpxinYXmRASgBP9nL3JQ52mIWuDqr2LbXzPEVEKwviWauPEvJU3G4xnMjpl4WvYOkQ',
      details: [
        'Displays live sensor values',
        'Clear distance visibility',
      ],
    },
    {
      name: 'LED Indicators',
      desc: 'Visual warning indicators.',
      image:
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQOMmXCh4-hKM9-FWJ6a6GpD26gcZCTCrnkI45hbwoqHHjGCcMXfJJHayfJoFX3hSzukGhGZkFpa0eP528',
      details: ['Green: Safe', 'Yellow: Warning', 'Red: Critical'],
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
      desc: 'Audio alert system for flood warnings.',
      image:
        'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRIsXSHeZJ4JUVCphKqiS8F-VDTipH6eiI9fjzcNU0yMuJV-NFH1-sYzmOqSs0EhRnZnNZ7McgWsj-cmIw',
      details: ['Real-time audible alerts'],
    },
    {
      name: 'Powerbank (10000mAh+)',
      desc: 'Portable power source for deployment.',
      image:
        'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQSbSRFuHAweazyFCC4KilXEx4gY6Z4EJqgOwCQ9_6rgMAEmLdQquJNEjWGvf_apKCoFBFE9lrf9dzua24',
      details: ['Portable power', 'Field-ready operation'],
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ===================== */}
      {/* LAYOUT 1 */}
      {/* ===================== */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50" />

        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>
            <h1 className="text-5xl font-bold mb-6">
              System{' '}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Functionality
              </span>
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              Advanced IoT components working together to provide intelligent,
              accurate, and real-time flood monitoring and alert systems.
            </p>

            <div className="mt-6 space-y-2 text-slate-600 text-sm">
              <p>• Real-time environmental monitoring</p>
              <p>• Cloud-based data transmission</p>
              <p>• Early flood detection system</p>
            </div>
          </div>

          {/* RIGHT - FLOATING IMAGE FRAME */}
          <div className="relative flex justify-center">
            <div className="w-80 h-80 rounded-3xl bg-white/40 backdrop-blur-xl border shadow-2xl flex items-center justify-center animate-pulse">
              <img
                src={coreSensors[0].image}
                className="w-56 h-56 object-contain"
                alt="system"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ===================== */}
      {/* LAYOUT 2 - CORE SENSORS */}
      {/* ===================== */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">

          <h2 className="text-4xl font-bold text-center mb-12">
            Core Sensors
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {coreSensors.map((sensor, i) => (
              <Card
                key={i}
                className="rounded-3xl bg-white/30 backdrop-blur-xl border shadow-lg hover:shadow-2xl transition"
              >
                <CardContent className="p-6 flex gap-5 items-center">

                  {/* CIRCLE IMAGE */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border bg-white flex-shrink-0">
                    <img
                      src={sensor.image}
                      className="w-full h-full object-cover"
                      alt={sensor.name}
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">{sensor.name}</h3>
                    <p className="text-xs text-cyan-600">{sensor.specs}</p>
                    <p className="text-sm text-slate-600">
                      {sensor.description}
                    </p>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* ===================== */}
      {/* LAYOUT 3 - SUPPORTING COMPONENTS */}
      {/* ===================== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">

          <h2 className="text-4xl font-bold text-center mb-12">
            Supporting Components
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportingComponents.map((c, i) => (
              <Card
                key={i}
                className="rounded-3xl bg-white/30 backdrop-blur-xl border shadow-lg hover:shadow-2xl transition"
              >
                <CardContent className="p-6 flex gap-5 items-center">

                  {/* CIRCLE IMAGE */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border bg-white flex-shrink-0">
                    <img
                      src={c.image}
                      className="w-full h-full object-cover"
                      alt={c.name}
                    />
                  </div>

                  <div>
                    <h3 className="font-bold">{c.name}</h3>
                    <p className="text-sm text-slate-600">{c.desc}</p>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>

          {/* BUTTON */}
          <div className="text-center mt-12">
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              Learn More
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}