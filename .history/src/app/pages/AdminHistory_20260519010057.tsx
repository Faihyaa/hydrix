import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from '../components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { History, Search, Settings, User } from 'lucide-react';
import { toast } from 'sonner';
import { getActivityLogs, type ActivityLog } from '../utils/activityLogger';
import { seedExampleLogs } from '../utils/seedExampleData';

export default function AdminHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
    // Seed example logs on first visit
    seedExampleLogs();
    loadLogs();
  }, [user, navigate]);

  const loadLogs = () => {
    setLogs(getActivityLogs());
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;

    const matchesMonth = filterMonth === 'all' || log.month === parseInt(filterMonth);
    const matchesYear = filterYear === 'all' || log.year === parseInt(filterYear);

    return matchesSearch && matchesCategory && matchesMonth && matchesYear;
  });

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sensor':
        return <Settings size={16} className="text-blue-600" />;
      case 'threshold':
        return <Settings size={16} className="text-purple-600" />;
      case 'system':
        return <User size={16} className="text-green-600" />;
      default:
        return <History size={16} className="text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sensor':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'threshold':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'system':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!user || user.role !== 'Admin') return null;

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8 animate-slide-up">
          <Card className="border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <History className="text-blue-600" size={24} />
                    Activity History
                  </CardTitle>
                  <CardDescription>
                    Track all administrative actions and changes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search by action, details, or admin name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2">
                  <Button
                    variant={filterCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCategory('all')}
                    className={filterCategory === 'all' ? 'bg-blue-600' : ''}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterCategory === 'sensor' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCategory('sensor')}
                    className={filterCategory === 'sensor' ? 'bg-blue-600' : ''}
                  >
                    Sensors
                  </Button>
                  <Button
                    variant={filterCategory === 'threshold' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCategory('threshold')}
                    className={filterCategory === 'threshold' ? 'bg-blue-600' : ''}
                  >
                    Thresholds
                  </Button>
                  <Button
                    variant={filterCategory === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCategory('system')}
                    className={filterCategory === 'system' ? 'bg-blue-600' : ''}
                  >
                    System
                  </Button>
                </div>

                {/* Month & Year Filter */}
                <div className="flex gap-2">
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="all">All Months</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('en', { month: 'short' })}</option>
                    ))}
                  </select>

                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="all">All Years</option>
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Activity Log List */}
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <History className="text-gray-300 mx-auto mb-4" size={64} />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Activity Logs</h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm || filterCategory !== 'all' 
                      ? 'No logs match your search criteria' 
                      : 'Administrative actions will appear here'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLogs.map((log) => (
                    <Card key={log.id} className="border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(log.category)}`}>
                            {getCategoryIcon(log.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{log.action}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {log.details}
                                </p>
                              </div>
                              <Badge variant="outline" className={getCategoryColor(log.category)}>
                                {log.category}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1.5">
                                <User size={14} />
                                <span>{log.adminName}</span>
                                <span className="text-gray-400">({log.adminEmail})</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <History size={14} />
                                <span>{formatDate(log.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}