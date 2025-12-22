import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import StatsCard from '../components/Dashboard/StatsCard';
import { Users, Clock, Building, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle, Car, Calendar, TrendingUp, Activity, Zap, Target } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { visitors, amenities, analytics, emergencyAlerts } = useApp();

  const pendingVisitors = visitors.filter(v => v.status === 'pending').length;
  const checkedInVisitors = visitors.filter(v => v.status === 'checked-in').length;
  const availableAmenities = amenities.filter(a => a.isAvailable).length;
  const activeAlerts = emergencyAlerts.filter(a => a.isActive).length;

  const getDashboardStats = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Total Visitors Today', value: analytics.visitorCount.today, icon: Users, color: 'blue' as const },
          { title: 'Pending Approvals', value: pendingVisitors, icon: Clock, color: 'yellow' as const },
          { title: 'Available Amenities', value: availableAmenities, icon: Building, color: 'green' as const },
          { title: 'Active Alerts', value: activeAlerts, icon: AlertTriangle, color: 'red' as const },
          { title: 'Weekly Trend', value: analytics.visitorCount.week, icon: TrendingUp, color: 'blue' as const },
          { title: 'Monthly Growth', value: analytics.visitorCount.month, icon: Target, color: 'green' as const }
        ];
      case 'security':
        return [
          { title: 'Checked-in Visitors', value: checkedInVisitors, icon: CheckCircle, color: 'green' as const },
          { title: 'Pending Check-ins', value: pendingVisitors, icon: Clock, color: 'yellow' as const },
          { title: 'Vehicles in Premises', value: 12, icon: Car, color: 'blue' as const },
          { title: 'Security Alerts', value: analytics.securityAlerts, icon: AlertTriangle, color: 'red' as const },
          { title: 'Shift Duration', value: '8h', icon: Activity, color: 'blue' as const },
          { title: 'Incidents', value: 0, icon: Zap, color: 'green' as const }
        ];
      case 'resident':
        return [
          { title: 'My Visitors Today', value: 3, icon: Users, color: 'blue' as const },
          { title: 'Active Bookings', value: 2, icon: Calendar, color: 'green' as const },
          { title: 'Available Amenities', value: availableAmenities, icon: Building, color: 'green' as const },
          { title: 'Notifications', value: 5, icon: AlertTriangle, color: 'yellow' as const },
          { title: 'Pending Requests', value: 1, icon: Clock, color: 'yellow' as const },
          { title: 'Profile Completion', value: '95%', icon: CheckCircle, color: 'green' as const }
        ];
      default:
        return [
          { title: 'My Visits', value: 1, icon: Calendar, color: 'blue' as const },
          { title: 'Approved', value: 1, icon: CheckCircle, color: 'green' as const },
          { title: 'Available Amenities', value: availableAmenities, icon: Building, color: 'green' as const },
          { title: 'Notifications', value: 2, icon: AlertTriangle, color: 'yellow' as const }
        ];
    }
  };

  const recentActivity = [
    { id: 1, action: 'Visitor Alice Johnson checked in', time: '2 minutes ago', type: 'checkin' },
    { id: 2, action: 'Gym booking confirmed for John Doe', time: '15 minutes ago', type: 'booking' },
    { id: 3, action: 'Emergency drill completed', time: '1 hour ago', type: 'emergency' },
    { id: 4, action: 'New visitor invitation sent', time: '2 hours ago', type: 'invitation' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checkin': return CheckCircle;
      case 'booking': return Calendar;
      case 'emergency': return AlertTriangle;
      case 'invitation': return Users;
      default: return Users;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'checkin': return 'text-green-600';
      case 'booking': return 'text-blue-600';
      case 'emergency': return 'text-red-600';
      case 'invitation': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {getDashboardStats().map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== recentActivity.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getActivityColor(activity.type)}`}>
                            <Icon className="h-5 w-5" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">{activity.action}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* System Health & Performance */}
      {(user?.role === 'admin' || user?.role === 'security' || user?.role === 'facility-manager') && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">99.8%</p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4 text-xs text-gray-500">All systems operational</div>
          </div>
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Response Time</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">145ms</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4 text-xs text-gray-500">Average system response</div>
          </div>
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Database Load</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">42%</p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-4 text-xs text-gray-500">Healthy usage levels</div>
          </div>
        </div>
      )}

      {/* Key Performance Indicators */}
      {user?.role === 'admin' && (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Key Performance Indicators</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Visitor Approval Rate</span>
                  <span className="text-sm font-bold text-green-600">94.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.2%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Amenity Utilization</span>
                  <span className="text-sm font-bold text-blue-600">78.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78.5%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Security Compliance</span>
                  <span className="text-sm font-bold text-orange-600">99.1%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '99.1%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Staff Attendance</span>
                  <span className="text-sm font-bold text-purple-600">96.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96.8%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions for Residents */}
      {user?.role === 'resident' && (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <button className="relative block w-full p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <Users className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">Invite Visitor</span>
              </button>
              <button className="relative block w-full p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <Calendar className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">Book Amenity</span>
              </button>
              <button className="relative block w-full p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <AlertTriangle className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">Report Issue</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}