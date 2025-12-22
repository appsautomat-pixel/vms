import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChartBar as BarChart3, TrendingUp, Users, Building, Clock, TriangleAlert as AlertTriangle, Download, Calendar, ArrowUp, ArrowDown, Activity, Target, Shield } from 'lucide-react';

export default function Analytics() {
  const { analytics, visitors, amenities } = useApp();
  const [dateRange, setDateRange] = useState('month');

  const visitorTrends = [
    { period: 'Today', count: analytics.visitorCount.today, trend: 12, isUp: true },
    { period: 'This Week', count: analytics.visitorCount.week, trend: 8, isUp: true },
    { period: 'This Month', count: analytics.visitorCount.month, trend: 15, isUp: true }
  ];

  const amenityUsageData = Object.entries(analytics.amenityUsage).map(([name, usage]) => ({
    name,
    usage,
    percentage: Math.round((usage / 100) * 100)
  }));

  const peakHours = analytics.peakHours;
  
  const statusBreakdown = {
    pending: visitors.filter(v => v.status === 'pending').length,
    approved: visitors.filter(v => v.status === 'approved').length,
    checkedIn: visitors.filter(v => v.status === 'checked-in').length,
    checkedOut: visitors.filter(v => v.status === 'checked-out').length,
    rejected: visitors.filter(v => v.status === 'rejected').length
  };

  const visitorSources = [
    { source: 'Pre-registered', count: 145, percentage: 45 },
    { source: 'Direct Walk-in', count: 89, percentage: 28 },
    { source: 'Delivery Personnel', count: 78, percentage: 24 },
    { source: 'Other', count: 8, percentage: 3 }
  ];

  const responseMetrics = [
    { metric: 'Avg Approval Time', value: '2.4m', icon: Clock, trend: 'down', positive: true },
    { metric: 'Check-in Speed', value: '1.8m', icon: Activity, trend: 'down', positive: true },
    { metric: 'System Uptime', value: '99.8%', icon: Shield, trend: 'stable', positive: true },
    { metric: 'Booking Fulfillment', value: '97.2%', icon: Target, trend: 'up', positive: true }
  ];

  const exportData = (format: 'excel' | 'pdf') => {
    alert(`Exporting analytics data to ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics & Reporting</h1>
          <p className="mt-1 text-sm text-gray-500">
            View visitor trends, amenity usage, and security insights.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => exportData('excel')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </button>
          <button
            onClick={() => exportData('pdf')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex space-x-2">
        {['week', 'month', 'quarter'].map(range => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dateRange === range
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {range === 'week' ? 'Week' : range === 'month' ? 'Month' : 'Quarter'}
          </button>
        ))}
      </div>

      {/* Visitor Trends */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Visitor Trends
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {visitorTrends.map((trend, index) => (
              <div key={trend.period} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{trend.count}</div>
                    <div className="text-sm text-gray-500 mt-1">{trend.period}</div>
                  </div>
                  <div className={`flex items-center ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.isUp ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                    <span className="ml-1 text-sm font-medium">{trend.trend}%</span>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${(trend.count / analytics.visitorCount.month) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visitor Status Breakdown */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Visitor Status Breakdown
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusBreakdown.pending}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statusBreakdown.approved}</div>
              <div className="text-sm text-gray-500">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{statusBreakdown.checkedIn}</div>
              <div className="text-sm text-gray-500">Checked In</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{statusBreakdown.checkedOut}</div>
              <div className="text-sm text-gray-500">Checked Out</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{statusBreakdown.rejected}</div>
              <div className="text-sm text-gray-500">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Amenity Usage */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Amenity Usage
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {amenityUsageData.map((amenity, index) => (
              <div key={amenity.name} className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-900">{amenity.name}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all"
                      style={{ width: `${amenity.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">{amenity.usage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Response Time Metrics */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Performance Metrics
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {responseMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={metric.metric} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-5 w-5 text-indigo-600" />
                    <span className={`text-xs font-semibold ${
                      metric.trend === 'up' ? 'text-green-600' :
                      metric.trend === 'down' ? 'text-green-600' :
                      'text-gray-600'
                    }`}>
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-xs text-gray-500 mt-2">{metric.metric}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visitor Sources */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Visitor Source Breakdown
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {visitorSources.map((item, index) => (
              <div key={item.source} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-900">{item.source}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <div className="text-sm font-bold text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Peak Hours
          </h3>
        </div>
        <div className="p-6">
          <div className="flex justify-center space-x-8">
            {peakHours.map((hour, index) => (
              <div key={hour} className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{hour}</div>
                <div className="text-sm text-gray-500">Peak #{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Insights */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Security Insights
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{analytics.securityAlerts}</div>
              <div className="text-sm text-red-700">Security Alerts</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-yellow-700">Blacklist Attempts</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-blue-700">Rejected Check-ins</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-green-700">System Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Activity Log
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-gray-900">Visitor Alice Johnson checked in</div>
                <div className="text-xs text-gray-500">2 minutes ago</div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Check-in
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-gray-900">Gym booked by John Resident</div>
                <div className="text-xs text-gray-500">15 minutes ago</div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Booking
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-gray-900">Emergency drill completed</div>
                <div className="text-xs text-gray-500">1 hour ago</div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Emergency
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}