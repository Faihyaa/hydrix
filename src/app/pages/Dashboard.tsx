import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ExternalLink, BarChart3, Activity } from 'lucide-react';

export default function Dashboard() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">IoT Dashboard</h1>
            <p className="text-xl text-gray-600">
              Real-time monitoring and data visualization
            </p>
          </div>

          {/* Integration Placeholder */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-white" size={24} />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-900">ThingsBoard Integration</CardTitle>
                  <CardDescription>Connect your IoT devices for real-time monitoring</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="text-blue-600" size={40} />
                </div>
                <h3 className="text-2xl font-semibold text-blue-900 mb-4">
                  Dashboard Integration Area
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                  This section is reserved for ThingsBoard integration. Connect your FlooDeT 
                  IoT devices to visualize real-time sensor data, monitor environmental conditions, 
                  and track historical trends.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-blue-900 mb-3">What You'll Monitor:</h4>
                  <div className="grid md:grid-cols-2 gap-3 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Water Level (cm)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Temperature (°C)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Humidity (%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Air Pressure (hPa)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Rainfall Intensity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Alert Status</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <a 
                    href="https://thingsboard.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Learn About ThingsBoard
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mt-6 border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Integration Steps:</h4>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">1.</span>
                  <span>Create a ThingsBoard account and device</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">2.</span>
                  <span>Configure your ESP32 with ThingsBoard credentials</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">3.</span>
                  <span>Embed the ThingsBoard dashboard iframe in this section</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">4.</span>
                  <span>Start monitoring your flood detection system in real-time</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
