import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Hop as Home, Users, Calendar, ChartBar as BarChart3, TriangleAlert as AlertTriangle, Car, Upload, Building, Settings, Shield, UserCheck, CreditCard, MessageSquare, Wrench, Smartphone } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
}

const navigation = {
  admin: [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Visitor Management', href: '/visitors', icon: Users },
    { name: 'Amenities', href: '/amenities', icon: Building },
    { name: 'Parking & Transport', href: '/parking', icon: Car },
    { name: 'Emergency', href: '/emergency', icon: AlertTriangle },
    { name: 'Community', href: '/community', icon: MessageSquare },
    { name: 'Staff Management', href: '/staff', icon: UserCheck },
    { name: 'Analytics & AI', href: '/analytics', icon: BarChart3 },
    { name: 'Bulk Operations', href: '/bulk-operations', icon: Upload },
    { name: 'System Settings', href: '/settings', icon: Settings }
  ],
  security: [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Visitor Control', href: '/visitors', icon: Users },
    { name: 'Emergency Response', href: '/emergency', icon: AlertTriangle },
    { name: 'Patrol & Monitoring', href: '/patrol', icon: Shield },
    { name: 'Parking Control', href: '/parking', icon: Car },
    { name: 'Amenity Monitoring', href: '/amenities', icon: Building },
    { name: 'Communication', href: '/communication', icon: Smartphone }
  ],
  'facility-manager': [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Amenity Management', href: '/amenities', icon: Building },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Staff Coordination', href: '/staff', icon: UserCheck },
    { name: 'Complaints', href: '/complaints', icon: MessageSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 }
  ],
  resident: [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'My Visitors', href: '/visitors', icon: Users },
    { name: 'Amenities & Booking', href: '/amenities', icon: Building },
    { name: 'Community', href: '/community', icon: MessageSquare },
    { name: 'Parking', href: '/parking', icon: Car },
    { name: 'Emergency', href: '/emergency', icon: AlertTriangle },
    { name: 'My Profile', href: '/profile', icon: Settings }
  ],
  visitor: [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'My Visits', href: '/visits', icon: Calendar },
    { name: 'Available Amenities', href: '/amenities', icon: Building },
    { name: 'Emergency', href: '/emergency', icon: AlertTriangle },
    { name: 'My Profile', href: '/profile', icon: Settings }
  ]
};

export default function Sidebar() {
  const { user } = useAuth();
  const { emergencyAlerts, complaints, aiInsights } = useApp();

  const userNavigation = navigation[user?.role as keyof typeof navigation] || [];
  const activeAlerts = emergencyAlerts.filter(a => a.isActive).length;
  const openComplaints = complaints.filter(c => c.status === 'open').length;
  const highPriorityInsights = aiInsights.filter(i => i.priority === 'high').length;

  const getBadgeCount = (itemName: string) => {
    switch (itemName) {
      case 'Emergency': return activeAlerts;
      case 'Complaints': return openComplaints;
      case 'AI Insights': return highPriorityInsights;
      default: return 0;
    }
  };

  const renderNavigationItem = (item: NavigationItem) => {
    const badgeCount = getBadgeCount(item.name);

    return (
      <NavLink
        key={item.name}
        to={item.href}
        className={({ isActive }) =>
          `group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`
        }
      >
        <div className="flex items-center">
          <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
          <span>{item.name}</span>
        </div>
        {badgeCount > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {badgeCount}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <Shield className="h-8 w-8 text-indigo-400" />
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">Residential VMS</h1>
              <p className="text-xs text-gray-400">Version 2.0</p>
            </div>
          </div>

          <div className="flex items-center px-4 mb-6">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                alt={user?.name}
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user?.role === 'security' ? 'bg-blue-100 text-blue-800' :
                  user?.role === 'facility-manager' ? 'bg-purple-100 text-purple-800' :
                  user?.role === 'resident' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {user?.role?.replace('-', ' ')}
                </span>
                {user?.apartmentNo && (
                  <span className="text-xs text-gray-400">{user.apartmentNo}</span>
                )}
              </div>
            </div>
          </div>

          <nav className="mt-5 flex-1 space-y-1 px-2">
            {userNavigation.map(item => renderNavigationItem(item))}
          </nav>

          <div className="mt-6 px-4">
            <div className="bg-gray-700 rounded-lg p-3">
              <h4 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">
                Quick Stats
              </h4>
              <div className="space-y-2">
                {user?.role === 'admin' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Active Visitors</span>
                      <span className="text-white font-medium">24</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Pending Approvals</span>
                      <span className="text-yellow-400 font-medium">8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Emergency Alerts</span>
                      <span className={`font-medium ${activeAlerts > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {activeAlerts}
                      </span>
                    </div>
                  </>
                )}
                {user?.role === 'resident' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">My Visitors Today</span>
                      <span className="text-white font-medium">2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Active Bookings</span>
                      <span className="text-blue-400 font-medium">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Pending Bills</span>
                      <span className="text-yellow-400 font-medium">₹2,500</span>
                    </div>
                  </>
                )}
                {user?.role === 'security' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">On Duty</span>
                      <span className="text-green-400 font-medium">Yes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Patrol Status</span>
                      <span className="text-blue-400 font-medium">Complete</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Incidents</span>
                      <span className="text-white font-medium">0</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
