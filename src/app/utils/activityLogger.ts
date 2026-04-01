export interface ActivityLog {
  id: string;
  timestamp: string;
  month: number; // 1-12
  year: number;
  adminName: string;
  adminEmail: string;
  action: string;
  details: string;
  category: 'sensor' | 'threshold' | 'system';
}

export function logActivity(
  adminName: string,
  adminEmail: string,
  action: string,
  details: string,
  category: 'sensor' | 'threshold' | 'system'
): void {
  const logs: ActivityLog[] = JSON.parse(localStorage.getItem('floodet_activity_logs') || '[]');
  
  const now = new Date();
  const newLog: ActivityLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: now.toISOString(),
    month: now.getMonth() + 1, // JavaScript months are 0-indexed
    year: now.getFullYear(),
    adminName,
    adminEmail,
    action,
    details,
    category
  };

  logs.unshift(newLog); // Add to beginning
  
  // Keep only last 500 logs
  if (logs.length > 500) {
    logs.splice(500);
  }
  
  localStorage.setItem('floodet_activity_logs', JSON.stringify(logs));
}

export function getActivityLogs(): ActivityLog[] {
  return JSON.parse(localStorage.getItem('floodet_activity_logs') || '[]');
}

export function clearActivityLogs(): void {
  localStorage.setItem('floodet_activity_logs', '[]');
}