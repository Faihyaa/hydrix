import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from '../components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { 
  Settings, 
  Power, 
  AlertTriangle,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Gauge
} from 'lucide-react';
import { toast } from 'sonner';
import { logActivity } from '../utils/activityLogger';

interface SensorStatus {
  esp32: boolean;
  ultrasonic: boolean;
  bme680: boolean;
  rainfall: boolean;
}

interface Threshold {
  normal: number;
  warning: number;
  critical: number;
}

interface ThresholdConfig {
  airPressure: Threshold;
  humidity: Threshold;
  rainfallIntensity: Threshold;
  temperature: Threshold;
  waterLevel: Threshold;
}

interface ThresholdCategory {
  key: keyof ThresholdConfig;
  icon: any;
  title: string;
  unit: string;
  color: string;
  guideline: [string, string, string];
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sensorStatus, setSensorStatus] = useState<SensorStatus>({
    esp32: true,
    ultrasonic: true,
    bme680: true,
    rainfall: true
  });

  const [thresholds, setThresholds] = useState<ThresholdConfig>({
    airPressure: { normal: 1013, warning: 1005, critical: 995 },
    humidity: { normal: 60, warning: 80, critical: 90 },
    rainfallIntensity: { normal: 10, warning: 30, critical: 60 },
    temperature: { normal: 24, warning: 32, critical: 38 },
    waterLevel: { normal: 50, warning: 100, critical: 150 }
  });

  useEffect(() => {
    const saved = localStorage.getItem('floodet_thresholds');
    if (saved) setThresholds(JSON.parse(saved));
    
    const savedSensors = localStorage.getItem('floodet_sensor_status');
    if (savedSensors) setSensorStatus(JSON.parse(savedSensors));
  }, []);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const handleSensorToggle = (sensor: keyof SensorStatus) => {
    setSensorStatus(prev => {
      const newStatus = { ...prev, [sensor]: !prev[sensor] };
      const action = newStatus[sensor] ? 'enabled' : 'disabled';
      const status = newStatus[sensor] ? 'Online' : 'Offline';
      localStorage.setItem('floodet_sensor_status', JSON.stringify(newStatus));
      logActivity(user.name, user.email, `Sensor ${action}`, `${sensor.toUpperCase()} sensor was ${action} - Status: ${status}`, 'sensor');
      toast.success(`${sensor.toUpperCase()} ${action} - ${status}`);
      return newStatus;
    });
  };

  const handleThresholdChange = (category: keyof ThresholdConfig, level: keyof Threshold, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setThresholds(prev => ({ ...prev, [category]: { ...prev[category], [level]: numValue } }));
    }
  };

  const handleSaveThresholds = () => {
    localStorage.setItem('floodet_thresholds', JSON.stringify(thresholds));
    logActivity(user.name, user.email, 'Threshold configuration saved', 'Updated threshold values for all sensors', 'threshold');
    toast.success('Threshold configuration saved successfully!');
  };

  const handleResetThresholds = () => {
    const defaultThresholds: ThresholdConfig = {
      airPressure: { normal: 1013, warning: 1005, critical: 995 },
      humidity: { normal: 60, warning: 80, critical: 90 },
      rainfallIntensity: { normal: 10, warning: 30, critical: 60 },
      temperature: { normal: 24, warning: 32, critical: 38 },
      waterLevel: { normal: 50, warning: 100, critical: 150 }
    };
    setThresholds(defaultThresholds);
    localStorage.setItem('floodet_thresholds', JSON.stringify(defaultThresholds));
    logActivity(user.name, user.email, 'Threshold reset', 'Reset all thresholds to default values', 'threshold');
    toast.success('Thresholds reset to default values');
  };

  const thresholdCategories: ThresholdCategory[] = [
    { key: 'airPressure', icon: Gauge, title: 'Air Pressure', unit: 'hPa', color: 'from-purple-500 to-purple-600', guideline: ['<1013', '<1005', '≥995'] },
    { key: 'humidity', icon: Droplets, title: 'Humidity', unit: '%', color: 'from-blue-500 to-blue-600', guideline: ['<60', '60–80', '≥90'] },
    { key: 'rainfallIntensity', icon: CloudRain, title: 'Rainfall Intensity', unit: 'mm/h', color: 'from-cyan-500 to-cyan-600', guideline: ['<10', '10–30', '≥60'] },
    { key: 'temperature', icon: Thermometer, title: 'Temperature', unit: '°C', color: 'from-orange-500 to-orange-600', guideline: ['<24', '24–32', '≥38'] },
    { key: 'waterLevel', icon: Wind, title: 'Water Level', unit: 'cm', color: 'from-blue-600 to-cyan-500', guideline: ['<50', '50–100', '≥100'] }
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Admin Control Panel</h1>
          <p className="text-gray-600">Manage sensors and configure system thresholds</p>
        </div>

        {/* Sensor Control Section */}
        <section className="mb-8">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Power className="text-blue-600" size={24} /> Sensor Control
              </CardTitle>
              <CardDescription>Toggle sensors on/off and monitor their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'esp32' as keyof SensorStatus, name: 'ESP32', icon: Power, color: 'from-green-500 to-green-600' },
                  { key: 'ultrasonic' as keyof SensorStatus, name: 'Ultrasonic', icon: Wind, color: 'from-blue-500 to-blue-600' },
                  { key: 'bme680' as keyof SensorStatus, name: 'BME680', icon: Thermometer, color: 'from-purple-500 to-purple-600' },
                  { key: 'rainfall' as keyof SensorStatus, name: 'Rainfall', icon: CloudRain, color: 'from-cyan-500 to-cyan-600' }
                ].map((sensor) => {
                  const Icon = sensor.icon;
                  const isOnline = sensorStatus[sensor.key];
                  return (
                    <Card key={sensor.key} className={`border-2 transition-all ${isOnline ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-gray-50'}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className={`w-14 h-14 bg-gradient-to-br ${sensor.color} rounded-xl flex items-center justify-center ${!isOnline && 'opacity-40 grayscale'}`}>
                            <Icon className="text-white" size={24} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{sensor.name}</h3>
                            <div className="flex items-center justify-center gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
                              <span className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                                {isOnline ? 'Online' : 'Offline'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <Switch
                              checked={isOnline}
                              onCheckedChange={() => handleSensorToggle(sensor.key)}
                              id={`sensor-${sensor.key}`}
                            />
                            <Label htmlFor={`sensor-${sensor.key}`} className="text-xs text-gray-600 cursor-pointer">
                              {isOnline ? 'Turn Off' : 'Turn On'}
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="mt-6 bg-amber-50 border-amber-200">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-amber-800">
                    <strong>Warning:</strong> Disabling sensors will stop data collection and may prevent flood detection. 
                    Only disable sensors for maintenance or testing purposes.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </section>

        {/* Threshold Configuration Section */}
        <section>
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Settings className="text-blue-600" size={24} /> Threshold Configuration
              </CardTitle>
              <CardDescription>Set custom threshold values for normal, warning, and critical levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {thresholdCategories.map((category) => {
                const Icon = category.icon;
                const values = thresholds[category.key];
                return (
                  <Card key={category.key} className="border-blue-100">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="text-white" size={20} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <CardDescription>Configure alert levels in {category.unit}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {(['normal','warning','critical'] as (keyof Threshold)[]).map((level, idx) => (
                          <div key={level} className="space-y-2">
                            <Label htmlFor={`${category.key}-${level}`} className="text-sm font-medium">
                              {level.charAt(0).toUpperCase() + level.slice(1)} ({category.guideline[idx]})
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id={`${category.key}-${level}`}
                                type="number"
                                step="0.1"
                                value={values[level]}
                                onChange={(e) => handleThresholdChange(category.key, level, e.target.value)}
                                className={`border ${
                                  level === 'normal' ? 'border-green-200 focus:border-green-400' :
                                  level === 'warning' ? 'border-amber-200 focus:border-amber-400' :
                                  'border-red-200 focus:border-red-400'
                                }`}
                              />
                              <span className="text-sm text-gray-500 whitespace-nowrap">{category.unit}</span>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs ${
                              level === 'normal' ? 'bg-green-50 border border-green-200 text-green-700' :
                              level === 'warning' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
                              'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                              {level === 'normal' ? 'Safe range' : level === 'warning' ? 'Monitor closely' : 'Immediate action'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSaveThresholds} className="flex-1 bg-blue-600 hover:bg-blue-700">Save Configuration</Button>
                <Button onClick={handleResetThresholds} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">Reset to Defaults</Button>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Thresholds determine when alerts are triggered. 
                    Normal values should be below warning, and warning values should be below critical. 
                    Adjust based on your local conditions and risk assessment.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
}