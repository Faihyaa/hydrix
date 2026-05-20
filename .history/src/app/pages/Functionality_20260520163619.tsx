import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function Functionality() {
  const coreSensors = [
    {
      name: 'ESP32',
      description: 'Powerful microcontroller with Wi-Fi and Bluetooth for data processing and transmission.',
      specs: 'Range (Wi-Fi): 50–100 m, Range (Bluetooth): 10 m',
      imagePlaceholder: 'esp32.png',
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
      imagePlaceholder: 'bme680.png',
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
      imagePlaceholder: 'ultrasonic.png',
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
      imagePlaceholder: 'rainfall.png',
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
      imagePlaceholder: 'nodemcu.png',
      details: [
        'Easily connects ESP32 with USB',
        'Supports breadboard prototyping',
        'Stable power regulation for components'
      ]
    },
    {
      name: 'Small Breadboard',
      desc: 'Board for building circuits without wiring.',
      imagePlaceholder: 'breadboard.png',
      details: [
        'Clean circuit layout',
        'Efficient wiring organization',
        'Supports multiple components'
      ]
    },
    {
      name: '4-in-1 Dot Matrix Display',
      desc: 'Visual display for real-time measurements.',
      imagePlaceholder: 'matrix_display.png',
      details: [
        'Shows sensor values clearly',
        'Easy to read from a distance'
      ]
    },
    {
      name: 'LED Indicators',
      desc: 'Visual status indicators (green/yellow/red).',
      imagePlaceholder: 'led.png',
      details: [
        'Green: Normal operation',
        'Yellow: Warning',
        'Red: Critical alert'
      ]
    },
    {
      name: 'Micro USB B Cable',
      desc: 'Power and data connection for ESP32.',
      imagePlaceholder: 'usb_cable.png',
      details: [
        'Transfers data for programming',
        'Supplies power during testing'
      ]
    },
    {
      name: 'Buzzer (Active)',
      desc: 'Audio alert for warnings and alarms.',
      imagePlaceholder: 'buzzer.png',
      details: [
        'Sounds alarm for critical events'
      ]
    },
    {
      name: 'Powerbank (10000mAh+)',
      desc: 'Portable power supply for field deployment.',
      imagePlaceholder: 'powerbank.png',
      details: [
        'Provides power',
        'Ensures continuous operation',
        'Portable and rechargeable'
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-center py-24 animate-fade-in">
        <div className="container mx-auto px-4 animate-slide-up">
          <h1 className="text-5xl font-bold mb-4">System Functionality</h1>
          <p className="text-xl text-blue-100 mb-4">
            Smart components working together for accurate and reliable flood detection.
          </p>
        </div>
      </section>

      {/* Core Sensors */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-blue-900 mb-3">Core Sensors</h2>
          <p className="text-xl text-gray-600">
            Key sensors that power the system’s environmental monitoring.
          </p>
        </div>
      
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {coreSensors.map((sensor, index) => (
            <Card
              key={index}
              className="w-full max-w-sm rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <CardContent className="p-6 space-y-4">
      
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-400">
                  {sensor.imagePlaceholder}
                </div>
      
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">
                    {sensor.name}
                  </h3>
                  <p className="text-sm text-blue-600 mb-2">
                    {sensor.specs}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {sensor.description}
                  </p>
                </div>
      
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                    Key Features
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {sensor.details.map((d, i) => (
                      <li key={i}>• {d}</li>
                    ))}
                  </ul>
                </div>
      
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Supporting Components */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-blue-900 mb-3">Supporting Components</h2>
            <p className="text-xl text-gray-600">
              Additional hardware required for full system operation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {supportingComponents.map((c, index) => (
              <Card key={index} className="w-full max-w-sm rounded-2xl shadow-md hover:shadow-xl transition">
                <CardContent className="p-6 space-y-4">
                  
                  <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-400">
                    {c.imagePlaceholder}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">
                      {c.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {c.desc}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                      Key Features
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {c.details.map((d, i) => (
                        <li key={i}>• {d}</li>
                      ))}
                    </ul>
                  </div>
                  
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}