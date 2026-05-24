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
      details: [
        'Green: Safe',
        'Yellow: Warning',
        'Red: Critical',
      ],
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
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* HERO */}
      <section className="relative py-32 overflow-hidden">
        
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50"></div>

        {/* Floating Blur Effects */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          
          <div className="max-w-4xl mx-auto text-center">

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              System{' '}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Functionality
              </span>
            </h1>

            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              Advanced IoT components working together to provide
              intelligent, accurate, and real-time flood monitoring
              and alert systems.
            </p>
          </div>
        </div>
      </section>

      {/* CORE SENSORS */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 max-w-7xl">

          <div className="text-center mb-16">
            Detection System
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Core{' '}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Sensors
              </span>
            </h2>

            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Smart environmental sensors designed for accurate flood monitoring and data collection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {coreSensors.map((sensor, index) => (
              <Card
                key={index}
                className="group border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-3xl overflow-hidden"
              >
                <CardContent className="p-8">

                  <div className="flex gap-6 items-start">

                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                      <img
                        src={sensor.image}
                        alt={sensor.name}
                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {sensor.name}
                      </h3>

                      <p className="text-cyan-600 font-medium text-sm mb-3">
                        {sensor.specs}
                      </p>

                      <p className="text-slate-600 leading-relaxed mb-5">
                        {sensor.description}
                      </p>

                      <ul className="space-y-2">
                        {sensor.details.map((d, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORTING COMPONENTS */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 max-w-7xl">

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Additional Hardware
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Supporting{' '}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Components
              </span>
            </h2>

            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Essential supporting hardware that enhances the performance and reliability of HydriX.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportingComponents.map((c, index) => (
              <Card
                key={index}
                className="group border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-3xl overflow-hidden"
              >
                <CardContent className="p-6">

                  <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden flex items-center justify-center mb-6 border border-slate-200">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {c.name}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    {c.desc}
                  </p>

                  <ul className="space-y-2">
                    {c.details.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        {d}
                      </li>
                    ))}
                  </ul>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}