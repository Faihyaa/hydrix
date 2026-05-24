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
      name: 'LED Indicators',
      desc: 'Visual warning indicators.',
      image:
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQOMmXCh4-hKM9-FWJ6a6GpD26gcZCTCrnkI45hbwoqHHjGCcMXfJJHayfJoFX3hSzukGhGZkFpa0eP528',
      details: ['Green: Safe', 'Yellow: Warning', 'Red: Critical'],
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">

      {/* ===================== */}
      {/* LAYOUT 1 - HERO SPLIT */}
      {/* ===================== */}
      <section className="relative py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}
            <div>
              <h1 className="text-5xl font-bold mb-6">
                System{' '}
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Functionality
                </span>
              </h1>

              <p className="text-slate-600 text-lg mb-6">
                Advanced IoT components working together to provide intelligent,
                accurate, and real-time flood monitoring and alert systems.
              </p>

              <div className="space-y-2 text-slate-600 text-sm">
                <p>• Continuous environmental monitoring</p>
                <p>• Real-time cloud synchronization</p>
                <p>• Early flood detection alerts</p>
                <p>• Smart risk classification system</p>
              </div>
            </div>

            {/* RIGHT - FLOATING IMAGE FRAME */}
            <div className="flex justify-center">
              <div className="relative w-[320px] h-[320px] rounded-3xl bg-white/60 backdrop-blur-xl border shadow-2xl overflow-hidden">
                <img
                  src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSTvSadrXHVw7u_IRgTC8vUBkMeaaD9p77Lt_mSp0NzNdzM13Xptx5r2XjilKkcmkuybSw3mweMg5_IkYk"
                  className="w-full h-full object-contain p-8"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================== */}
      {/* LAYOUT 2 - CORE SENSORS */}
      {/* ===================== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">

          <h2 className="text-4xl font-bold text-center mb-14">
            Core <span className="text-cyan-500">Sensors</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {coreSensors.map((sensor, i) => (
              <Card
                key={i}
                className="rounded-3xl border bg-white/60 backdrop-blur-xl shadow-lg hover:shadow-2xl transition"
              >
                <CardContent className="p-6 flex gap-5 items-start">

                  {/* CIRCLE IMAGE */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border bg-white flex-shrink-0">
                    <img
                      src={sensor.image}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div>
                    <h3 className="font-bold text-lg">{sensor.name}</h3>
                    <p className="text-xs text-cyan-600 mb-1">{sensor.specs}</p>
                    <p className="text-sm text-slate-600 mb-3">
                      {sensor.description}
                    </p>

                    <div className="space-y-1">
                      {sensor.details.map((d, idx) => (
                        <p key={idx} className="text-xs text-slate-500">
                          • {d}
                        </p>
                      ))}
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== */}
      {/* LAYOUT 3 - SUPPORTING */}
      {/* ===================== */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-cyan-50">
        <div className="container mx-auto px-4 max-w-7xl">

          <h2 className="text-4xl font-bold text-center mb-14">
            Supporting <span className="text-cyan-500">Components</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportingComponents.map((c, i) => (
              <Card
                key={i}
                className="rounded-3xl bg-white/60 backdrop-blur-xl shadow-lg hover:shadow-2xl transition"
              >
                <CardContent className="p-6 flex gap-5">

                  {/* CIRCLE IMAGE */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border bg-white flex-shrink-0">
                    <img
                      src={c.image}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* TEXT */}
                  <div>
                    <h3 className="font-bold">{c.name}</h3>
                    <p className="text-sm text-slate-600">{c.desc}</p>

                    <div className="mt-2 space-y-1">
                      {c.details.map((d, idx) => (
                        <p key={idx} className="text-xs text-slate-500">
                          • {d}
                        </p>
                      ))}
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>

          {/* BUTTON */}
          <div className="flex justify-center mt-12">
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:opacity-90">
              Learn More
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}