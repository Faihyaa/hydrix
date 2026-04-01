import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function Functionality() {
  const coreSensors = [
    {
      name: 'ESP32',
      description: 'Powerful microcontroller with Wi-Fi and Bluetooth for data processing and transmission.',
      specs: 'Dual-core processor with Wi-Fi & Bluetooth',
      imagePlaceholder: 'esp32.png',
      details: [
        'Stable 3.3V operation',
        'Supports Wi-Fi and Bluetooth communication',
        'Fast processing with dual-core CPU'
      ]
    },
    {
      name: 'Ultrasonic Sensor (HC-SR04)',
      description: 'Measures water level distance accurately without contact.',
      specs: 'Range: 2-400cm, Accuracy: ±3mm',
      imagePlaceholder: 'ultrasonic.png',
      details: [
        'Measures distance using sound waves',
        'Non-contact water level detection',
        'Suitable for flood monitoring'
      ]
    },
    {
      name: 'BME680 Sensor',
      description: 'Environmental sensor for temperature, humidity, and air pressure.',
      specs: 'Measures temperature, humidity, and air pressure',
      imagePlaceholder: 'bme680.png',
      details: [
        'Tracks temperature and humidity',
        'Monitors air pressure',
        'Compact sensor suitable for field use'
      ]
    },
    {
      name: 'Rainfall Sensor',
      description: 'Detects rainfall intensity for flood prediction.',
      specs: 'Digital and analog output for rain detection',
      imagePlaceholder: 'rainfall.png',
      details: [
        'Detects rainfall amount and intensity',
        'Alerts system when rain is detected',
        'Easy to integrate with microcontrollers'
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
      desc: 'For prototyping without soldering.',
      imagePlaceholder: 'breadboard.png',
      details: [
        'Quick circuit testing',
        'Organize wiring efficiently',
        'Reusable for multiple experiments'
      ]
    },
    {
      name: '4-in-1 Dot Matrix Display',
      desc: 'Visual display for real-time measurements.',
      imagePlaceholder: 'matrix_display.png',
      details: [
        'Shows sensor values clearly',
        'Easy to read from a distance',
        'Compact and easy to mount'
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
        'Supplies power during testing',
        'High-quality cable recommended'
      ]
    },
    {
      name: 'Buzzer (Active)',
      desc: 'Audio alert for warnings and alarms.',
      imagePlaceholder: 'buzzer.png',
      details: [
        'Sounds alarm for critical events',
        'Easy to integrate with system',
        'Operates on standard voltage'
      ]
    },
    {
      name: 'Powerbank (10000mAh+)',
      desc: 'Portable power supply for field deployment.',
      imagePlaceholder: 'powerbank.png',
      details: [
        'Provides backup power',
        'Ensures continuous operation',
        'Portable and rechargeable'
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-4">System Functionality</h1>
          <p className="text-xl text-blue-100">
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
      <section className="bg-blue-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-blue-900 mb-3">Supporting Components</h2>
            <p className="text-xl text-gray-600">
              Additional hardware required for full system operation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportingComponents.map((c, index) => (
              <Card key={index} className="rounded-2xl shadow-sm hover:shadow-lg transition">
                <CardHeader className="text-center">
                  <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 mb-3">
                    {c.imagePlaceholder}
                  </div>
                  <CardTitle className="text-lg text-blue-900">{c.name}</CardTitle>
                  <p className="text-sm text-gray-600">{c.desc}</p>
                </CardHeader>

                <div className="bg-gray-100 p-3">
                  <CardContent>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {c.details.map((d, i) => (
                        <li key={i}>• {d}</li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>
    </Layout>
  );
}