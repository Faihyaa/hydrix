import { Card, CardContent } from '../components/ui/card';

export default function Functionality() {
  const coreSensors = [
    {
      name: 'ESP32',
      description: 'Powerful microcontroller with Wi-Fi and Bluetooth for data processing and transmission.',
      specs: 'Range (Wi-Fi): 50–100 m, Range (Bluetooth): 10 m',
      image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcSTvSadrXHVw7u_IRgTC8vUBkMeaaD9p77Lt_mSp0NzNdzM13Xptx5r2XjilKkcmkuybSw3mweMg5_IkYk',
      details: [
        'Stable 3.3V operation',
        'Supports Wi-Fi and Bluetooth communication',
        'Fast processing with dual-core CPU'
      ]
    },
    {
      name: 'BME680 Sensor',
      description: 'Environmental sensor for temperature, humidity, and air pressure.',
      specs: 'Temperature: ±1 °C, Humidity: ±3 %, Pressure: ±1 hPa',
      image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTKxVX288nwiWd1gDWOUP4UobD7wdfOlW3pI63JQz1guKHyqkSbvYgdpLD-Z3Gh8rF8AK4jP266pc2iOvo',
      details: [
        'Tracks temperature and humidity',
        'Monitors air pressure',
        'Customizable Thresholds'
      ]
    },
    {
      name: 'Ultrasonic Sensor (HC-SR04P)',
      description: 'Measures water level distance without contact.',
      specs: 'Range: 2-400cm, Accuracy: ±3mm',
      image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQLald-qL171-sFED6Uxa_EcbX06ieLHoeYZz0jHDX60pZ72ttGzKrLn3n6s55uhFFvxOZ3kGCjpALniDo',
      details: [
        'Measures distance using sound waves',
        'Non-contact water level detection',
        'Customizable Thresholds'
      ]
    },
    {
      name: 'Rainfall Sensor',
      description: 'Measures rainfall intensity.',
      specs: 'Range: 0–200 mm/h, Accuracy: ±5 %',
      image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcThY4dIYPWmg0qtoXRFh_MDMp96tzJJjDibdm7hVknfQvpW6YxmgtRWs4QPUSeX5EJIbjlrh_jpLbYIo-Q',
      details: [
        'Detects rainfall amount and intensity',
        'Alerts system when rain is detected',
        'Customizable Thresholds'
      ]
    }
  ];

  const supportingComponents = [
    {
      name: 'NodeMCU V3 Base Board',
      desc: 'ESP32 development board with USB interface.',
      image: 'https://admin.robotedu.my/image/robotedu/image/data/all_product_images/product-192/gelck27k1753781601.jpg',
      details: [
        'Easily connects ESP32 with USB',
        'Supports breadboard prototyping',
        'Stable power regulation for components'
      ]
    },
    {
      name: 'Small Breadboard',
      desc: 'Board for building circuits without wiring.',
      image: 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcRlz_xTSNyhWUnrJaezCoHibk9KooLCYXTyvyaI2lpkZbT3H4LibsCxnyAQxfQS4OGPvy1SU6AakmCC97I',
      details: [
        'Clean circuit layout',
        'Efficient wiring organization',
        'Supports multiple components'
      ]
    },
    {
      name: '4-in-1 Dot Matrix Display',
      desc: 'Visual display for real-time measurements.',
      image: 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcT5pl0w1MHFiBNeoTpxinYXmRASgBP9nL3JQ52mIWuDqr2LbXzPEVEKwviWauPEvJU3G4xnMjpl4WvYOkQ',
      details: [
        'Shows sensor values clearly',
        'Easy to read from a distance'
      ]
    },
    {
      name: 'LED Indicators',
      desc: 'Visual status indicators (green/yellow/red).',
      image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQOMmXCh4-hKM9-FWJ6a6GpD26gcZCTCrnkI45hbwoqHHjGCcMXfJJHayfJoFX3hSzukGhGZkFpa0eP528',
      details: [
        'Green: Normal operation',
        'Yellow: Warning',
        'Red: Critical alert'
      ]
    },
    {
      name: 'Micro USB B Cable',
      desc: 'Power and data connection for ESP32.',
      image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSKSIdw7RX8yOzaMmuJzYhVLi3psnF8g_p_unpMIOAW7STmDXXJd9aF6QjTNvF5MpX_V4sWKiCuyaymnqs',
      details: [
        'Transfers data for programming',
        'Supplies power during testing'
      ]
    },
    {
      name: 'Buzzer (Active)',
      desc: 'Audio alert for warnings and alarms.',
      image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRIsXSHeZJ4JUVCphKqiS8F-VDTipH6eiI9fjzcNU0yMuJV-NFH1-sYzmOqSs0EhRnZnNZ7McgWsj-cmIw',
      details: [
        'Sounds alarm for critical events'
      ]
    },
    {
      name: 'Powerbank (10000mAh+)',
      desc: 'Portable power supply for field deployment.',
      image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQSbSRFuHAweazyFCC4KilXEx4gY6Z4EJqgOwCQ9_6rgMAEmLdQquJNEjWGvf_apKCoFBFE9lrf9dzua24',
      details: [
        'Provides power',
        'Ensures continuous operation',
        'Portable and rechargeable'
      ]
    }
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-center py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">System Functionality</h1>
          <p className="text-xl text-blue-100">
            Smart components working together for accurate and reliable flood detection.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-blue-900 mb-3">Core Sensors</h2>
        </div>
      
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {coreSensors.map((sensor, index) => (
            <Card key={index} className="w-full max-w-sm rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="w-full aspect-square bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                  <img src={sensor.image} alt={sensor.name} className="w-full h-full object-contain p-2" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">{sensor.name}</h3>
                  <p className="text-sm text-blue-600 mb-2">{sensor.specs}</p>
                  <p className="text-gray-600 text-sm">{sensor.description}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <ul className="space-y-1 text-sm text-gray-700">
                    {sensor.details.map((d, i) => <li key={i}>• {d}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-blue-900 mb-3">Supporting Components</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {supportingComponents.map((c, index) => (
              <Card key={index} className="w-full max-w-sm rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="w-full aspect-square bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                    <img src={c.image} alt={c.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">{c.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{c.desc}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <ul className="space-y-1 text-sm text-gray-700">
                      {c.details.map((d, i) => <li key={i}>• {d}</li>)}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}