import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Settings, LogOut, Shield, TriangleAlert as AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { emergencyAlerts } = useApp();

  const activeAlerts = emergencyAlerts.filter(alert => alert.isActive);
  const hasEmergency = activeAlerts.length > 0;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'security': return 'bg-blue-100 text-blue-800';
      case 'resident': return 'bg-green-100 text-green-800';
      case 'visitor': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-indigo-600" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">
              Residential VMS
            </h1>
          </div>
          
          {hasEmergency && (
            <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full animate-pulse">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Emergency Active</span>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeAlerts.length}
                </span>
              )}
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Settings className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(user?.role || '')}`}>
                    {user?.role}
                  </span>
                  {user?.apartmentNo && (
                    <span className="text-xs text-gray-500">{user.apartmentNo}</span>
                  )}
                </div>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-500"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}