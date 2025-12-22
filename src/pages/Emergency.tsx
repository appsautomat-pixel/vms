import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { TriangleAlert as AlertTriangle, Siren, Shield, Users, Phone, CircleCheck as CheckCircle, Clock, MessageSquare } from 'lucide-react';

export default function Emergency() {
  const { user } = useAuth();
  const { emergencyAlerts, triggerEmergency, acknowledgeAlert, amenities, visitors } = useApp();
  const [selectedAlertType, setSelectedAlertType] = useState('evacuation');
  const [alertMessage, setAlertMessage] = useState('');

  const alertTypes = [
    { value: 'evacuation', label: 'Evacuation', icon: AlertTriangle, color: 'red' },
    { value: 'fire', label: 'Fire Emergency', icon: Siren, color: 'red' },
    { value: 'medical', label: 'Medical Emergency', icon: Shield, color: 'orange' },
    { value: 'security', label: 'Security Alert', icon: Shield, color: 'yellow' }
  ];

  const activeAlerts = emergencyAlerts.filter(alert => alert.isActive);
  const currentOccupancy = amenities.reduce((total, amenity) => total + amenity.currentOccupancy, 0);
  const checkedInVisitors = visitors.filter(v => v.status === 'checked-in').length;
  const totalOccupancy = currentOccupancy + checkedInVisitors;

  const handleTriggerEmergency = () => {
    if (!alertMessage.trim()) {
      alert('Please enter an alert message');
      return;
    }

    triggerEmergency({
      type: selectedAlertType as any,
      message: alertMessage,
      timestamp: new Date().toISOString(),
      isActive: true
    });

    setAlertMessage('');
    alert('Emergency alert triggered successfully!');
  };

  const handleAcknowledge = (alertId: string) => {
    if (user) {
      acknowledgeAlert(alertId, user.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Emergency Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor emergency alerts and manage crisis situations.
        </p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Occupancy</div>
              <div className="text-2xl font-semibold text-gray-900">{totalOccupancy}</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Visitors Checked In</div>
              <div className="text-2xl font-semibold text-gray-900">{checkedInVisitors}</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-lg ${activeAlerts.length > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Active Alerts</div>
              <div className="text-2xl font-semibold text-gray-900">{activeAlerts.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-medium text-red-900 flex items-center mb-4">
            <Siren className="h-5 w-5 mr-2" />
            Active Emergency Alerts
          </h3>
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className="bg-white border border-red-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-red-900 capitalize">{alert.type} Alert</h4>
                    <p className="text-red-700 mt-1">{alert.message}</p>
                    <p className="text-red-600 text-sm mt-2">
                      Triggered: {new Date(alert.timestamp).toLocaleString()}
                    </p>
                    <p className="text-red-600 text-sm">
                      Acknowledged by: {alert.acknowledgedBy.length} people
                    </p>
                  </div>
                  {!alert.acknowledgedBy.includes(user?.id || '') && (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Trigger (Admin/Security Only) */}
      {(user?.role === 'admin' || user?.role === 'security') && (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Trigger Emergency Alert</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Type
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {alertTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setSelectedAlertType(type.value)}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                        selectedAlertType === type.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`h-8 w-8 mb-2 ${
                        selectedAlertType === type.value ? 'text-red-600' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        selectedAlertType === type.value ? 'text-red-900' : 'text-gray-700'
                      }`}>
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="alert-message" className="block text-sm font-medium text-gray-700 mb-2">
                Alert Message
              </label>
              <textarea
                id="alert-message"
                rows={3}
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter detailed emergency message..."
              />
            </div>

            <button
              onClick={handleTriggerEmergency}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <Siren className="h-5 w-5 mr-2" />
              Trigger Emergency Alert
            </button>
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Emergency Contacts</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center p-4 bg-red-50 rounded-lg">
              <Phone className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <div className="font-medium text-red-900">Fire Department</div>
                <div className="text-red-700">911</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <Phone className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-blue-900">Police</div>
                <div className="text-blue-700">911</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <Phone className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-green-900">Medical Emergency</div>
                <div className="text-green-700">911</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <Phone className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <div className="font-medium text-yellow-900">Building Security</div>
                <div className="text-yellow-700">(555) 123-4567</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <Phone className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-purple-900">Management Office</div>
                <div className="text-purple-700">(555) 987-6543</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Phone className="h-8 w-8 text-gray-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Maintenance</div>
                <div className="text-gray-700">(555) 456-7890</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}