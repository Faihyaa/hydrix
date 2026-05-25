import { ActivityLog } from './activityLogger';

export function seedExampleLogs(): void {
  // Check if we already have logs seeded
  const existing = localStorage.getItem('hydrix_logs_seeded');
  if (existing) return;

  const exampleLogs: ActivityLog[] = [
    {
      id: 'log_example_1',
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