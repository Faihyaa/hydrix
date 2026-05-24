import { ActivityLog } from './activityLogger';

export function seedExampleLogs(): void {
  // Check if we already have logs seeded
  const existing = localStorage.getItem('hydrix_logs_seeded');
  if (existing) return;

  const exampleLogs: ActivityLog[] = [
    // January 2026 - Threshold examples
    {
      id: 'log_example_1',
      timestamp: new Date(2026, 0, 15, 10, 30).toISOString(),
      month: 1,
      year: 2026,
      adminName: 'Core Admin',
      adminEmail: 'adminhydrix@gmail.com',
      action: 'Threshold configuration saved',
      details: 'Updated Water Level thresholds: Normal < 50cm, Warning 50-100cm, Critical ≥ 150cm',
      category: 'threshold'
    },
    {
      id: 'log_example_2',
      timestamp: new Date(2026, 0, 20, 14, 15).toISOString(),
      month: 1,
      year: 2026,
      adminName: 'Core Admin',
      adminEmail: 'adminhydrix@gmail.com',
      action: 'Threshold configuration saved',
      details: 'Updated Temperature thresholds: Normal < 24°C, Warning 24-32°C, Critical ≥ 38°C',
      category: 'threshold'
    },
    // February 2026
    {
      id: 'log_example_3',
      timestamp: new Date(2026, 1, 5, 9, 45).toISOString(),
      month: 2,
      year: 2026,
      adminName: 'Core Admin',
      adminEmail: 'adminhydrix@gmail.com',
      action: 'Sensor enabled',
      details: 'ESP32 sensor was enabled - Status: Online',
      category: 'sensor'
    },
    {
      id: 'log_example_4',
      timestamp: new Date(2026, 1, 10, 16, 20).toISOString(),
      month: 2,
      year: 2026,
      adminName: 'Core Admin',
      adminEmail: 'adminhydrix@gmail.com',
      action: 'Threshold configuration saved',
      details: 'Updated Humidity thresholds: Normal < 60%, Warning 60-80%, Critical ≥ 90%',
      category: 'threshold'
    },
    // March 2026
    {
      id: 'log_example_5',
      timestamp: new Date(2026, 2, 12, 11, 10).toISOString(),
      month: 3,
      year: 2026,
      adminName: 'Core Admin',
      adminEmail: 'adminhydrix@gmail.com',
      action: 'Sensor disabled',
      details: 'ULTRASONIC sensor was disabled - Status: Offline',
      category: 'sensor'
    },
    {
      id: 'log_example_6',
      timestamp: new Date(2026, 2, 18, 13, 30).toISOString(),
      month: 3,
      year: 2026,
      adminName: 'Core Admin',
      adminEmail: 'adminhydrix@gmail.com',
      action: 'Threshold configuration saved',
      details: 'Updated Rainfall Intensity thresholds: Normal < 10mm/h, Warning 10-30mm/h, Critical ≥ 60mm/h',
      category: 'threshold'
    },
    // April 2026 - Recent
    {
      id: 'log_example_7',
      timestamp: new Date(2026, 3, 1, 8, 15).toISOString(),
      month: 4,
      year: 2026,
      adminName: 'Core Admin',
      adminEmail: 'adminhydrix@gmail.com',
      action: 'Sensor enabled',
      details: 'ULTRASONIC sensor was enabled - Status: Online',
      category: 'sensor'
    },
    {
      id: 'log_example_8',
      timestamp: new Date(2026, 2, 25, 15, 45).toISOString(),
      month: 3,
      year: 2026,
      adminName: 'Core Admin',
      adminEmail: 'adminhydrix@gmail.com',
      action: 'Threshold configuration saved',
      details: 'Updated Air Pressure thresholds: Normal < 1013hPa, Warning < 1005hPa, Critical ≥ 995hPa',
      category: 'threshold'
    },
    {
      id: 'log_example_9',
      timestamp: new Date(2026, 2, 28, 10, 20).toISOString(),
      month: 3,
      year: 2026,
      adminName: 'Core Admin',
      adminEmail: 'adminhydrix@gmail.com',
      action: 'User added',
      details: 'Added new user: John Doe (john@example.com)',
      category: 'system'
    }
  ];

  // Get existing logs
  const currentLogs: ActivityLog[] = JSON.parse(localStorage.getItem('hydrix_activity_logs') || '[]');
  
  // Add example logs at the end (they'll be older)
  const allLogs = [...currentLogs, ...exampleLogs];
  
  localStorage.setItem('hydrix_activity_logs', JSON.stringify(allLogs));
  localStorage.setItem('hydrix_logs_seeded', 'true');
}