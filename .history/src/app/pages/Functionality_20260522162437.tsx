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
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50"></div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="text-5xl font-bold mb-4">
            System{' '}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Functionality
            </span>
          </h1>

          <p className="text-slate-600 text-lg">
            Advanced IoT flood monitoring system combining sensors,
            communication modules, and real-time alerts.
          </p>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl grid lg:grid-cols-3 gap-12">

          {/* LEFT SIDE - SYSTEM FUNCTIONALITY */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold mb-4">System Functionality</h2>
            <p className="text-slate-600 leading-relaxed">
              The HydriX system continuously collects environmental data using multiple sensors.
              Data is processed in real-time and transmitted to the cloud for analysis and alert generation.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p>• Continuous environmental monitoring</p>
              <p>• Real-time cloud synchronization</p>
              <p>• Early flood detection alerts</p>
              <p>• Automated risk level classification</p>
            </div>
          </div>

          {/* RIGHT SIDE - COMPONENTS */}
          <div className="lg:col-span-2 space-y-10">

            {/* CORE SENSORS */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Core Sensors</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {coreSensors.map((sensor, i) => (
                  <Card key={i} className="rounded-2xl shadow-md">
                    <CardContent className="p-5 flex gap-4">

                      {/* CIRCLE IMAGE */}
                      <div className="w-20 h-20 rounded-full overflow-hidden border flex-shrink-0 bg-white">
                        <img
                          src={sensor.image}
                          alt={sensor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* TEXT */}
                      <div>
                        <h4 className="font-bold">{sensor.name}</h4>
                        <p className="text-xs text-cyan-600 mb-1">{sensor.specs}</p>
                        <p className="text-sm text-slate-600">{sensor.description}</p>
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* SUPPORTING COMPONENTS */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Supporting Components</h3>

              <div className="grid sm:grid-cols-2 gap-6">
                {supportingComponents.map((c, i) => (
                  <Card key={i} className="rounded-2xl shadow-md">
                    <CardContent className="p-5 flex gap-4">

                      {/* CIRCLE IMAGE */}
                      <div className="w-20 h-20 rounded-full overflow-hidden border flex-shrink-0 bg-white">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* TEXT */}
                      <div>
                        <h4 className="font-bold">{c.name}</h4>
                        <p className="text-sm text-slate-600">{c.desc}</p>
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* BUTTON */}
            <div className="pt-4">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 transition">
                Learn More
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}