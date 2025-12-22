import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Car, Zap, MapPin, Clock, CircleCheck, CircleAlert as AlertCircle, Plus, Search, ListFilter as Filter, Battery, Timer } from 'lucide-react';

export default function Parking() {
  const { user } = useAuth();
  const { parkingSlots, updateParkingSlot } = useApp();
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const floors = ['all', 'Ground', 'Basement', 'Level 1', 'Level 2'];
  const types = ['all', 'resident', 'visitor', 'ev-charging', 'disabled'];

  const filteredSlots = parkingSlots.filter(slot => {
    const matchesFloor = selectedFloor === 'all' || slot.floor === selectedFloor;
    const matchesType = selectedType === 'all' || slot.type === selectedType;
    const matchesSearch = searchTerm === '' || 
      slot.slotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.occupiedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFloor && matchesType && matchesSearch;
  });

  const occupiedSlots = parkingSlots.filter(slot => slot.isOccupied).length;
  const totalSlots = parkingSlots.length;
  const occupancyRate = Math.round((occupiedSlots / totalSlots) * 100);

  const evChargingSlots = parkingSlots.filter(slot => slot.type === 'ev-charging');
  const activeCharging = evChargingSlots.filter(slot => slot.chargingStatus === 'charging').length;

  const getSlotStatusColor = (slot: any) => {
    if (!slot.isOccupied) return 'bg-green-100 text-green-800 border-green-200';
    if (slot.type === 'ev-charging' && slot.chargingStatus === 'charging') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getSlotIcon = (slot: any) => {
    if (slot.type === 'ev-charging') return Zap;
    if (slot.type === 'disabled') return MapPin;
    return Car;
  };

  const handleSlotAction = (slotId: string, action: 'occupy' | 'vacate' | 'start-charging' | 'stop-charging') => {
    const slot = parkingSlots.find(s => s.id === slotId);
    if (!slot) return;

    switch (action) {
      case 'occupy':
        updateParkingSlot(slotId, {
          isOccupied: true,
          occupiedBy: 'Demo User',
          vehicleNumber: 'MH01AB1234',
          timeIn: new Date().toISOString()
        });
        break;
      case 'vacate':
        updateParkingSlot(slotId, {
          isOccupied: false,
          occupiedBy: undefined,
          vehicleNumber: undefined,
          timeIn: undefined,
          timeOut: new Date().toISOString(),
          chargingStatus: slot.type === 'ev-charging' ? 'available' : undefined
        });
        break;
      case 'start-charging':
        updateParkingSlot(slotId, {
          chargingStatus: 'charging'
        });
        break;
      case 'stop-charging':
        updateParkingSlot(slotId, {
          chargingStatus: 'completed'
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Parking & Transport Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor parking occupancy, manage EV charging, and track vehicle access.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <Car className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Occupancy</div>
              <div className="text-2xl font-semibold text-gray-900">{occupiedSlots}/{totalSlots}</div>
              <div className="text-sm text-gray-500">{occupancyRate}% occupied</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <CircleCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Available Slots</div>
              <div className="text-2xl font-semibold text-gray-900">{totalSlots - occupiedSlots}</div>
              <div className="text-sm text-gray-500">Ready for parking</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                <Zap className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">EV Charging</div>
              <div className="text-2xl font-semibold text-gray-900">{activeCharging}/{evChargingSlots.length}</div>
              <div className="text-sm text-gray-500">Active sessions</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                <Timer className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Avg Duration</div>
              <div className="text-2xl font-semibold text-gray-900">2.5h</div>
              <div className="text-sm text-gray-500">Per parking session</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by slot number, owner, or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {floors.map((floor) => (
                  <option key={floor} value={floor}>
                    {floor === 'all' ? 'All Floors' : floor}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Parking Grid */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Parking Layout</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Charging</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredSlots.map((slot) => {
            const SlotIcon = getSlotIcon(slot);
            return (
              <div
                key={slot.id}
                className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${getSlotStatusColor(slot)}`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <SlotIcon className="h-6 w-6" />
                  <div className="text-sm font-medium">{slot.slotNumber}</div>
                  <div className="text-xs text-center">
                    <div>{slot.floor} Floor</div>
                    <div className="capitalize">{slot.type.replace('-', ' ')}</div>
                  </div>
                  
                  {slot.isOccupied && (
                    <div className="text-xs text-center">
                      <div className="font-medium">{slot.occupiedBy}</div>
                      <div>{slot.vehicleNumber}</div>
                      {slot.timeIn && (
                        <div className="text-gray-500">
                          {new Date(slot.timeIn).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  )}

                  {slot.type === 'ev-charging' && slot.isOccupied && (
                    <div className="flex items-center space-x-1 text-xs">
                      <Battery className="h-3 w-3" />
                      <span className="capitalize">{slot.chargingStatus}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {(user?.role === 'admin' || user?.role === 'security') && (
                  <div className="absolute top-1 right-1">
                    {!slot.isOccupied ? (
                      <button
                        onClick={() => handleSlotAction(slot.id, 'occupy')}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Mark as occupied"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSlotAction(slot.id, 'vacate')}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Mark as vacant"
                      >
                        <Clock className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* EV Charging Controls */}
                {slot.type === 'ev-charging' && slot.isOccupied && (user?.role === 'admin' || user?.role === 'resident') && (
                  <div className="mt-2 flex justify-center">
                    {slot.chargingStatus === 'available' && (
                      <button
                        onClick={() => handleSlotAction(slot.id, 'start-charging')}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Start Charging
                      </button>
                    )}
                    {slot.chargingStatus === 'charging' && (
                      <button
                        onClick={() => handleSlotAction(slot.id, 'stop-charging')}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Stop Charging
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* EV Charging Status */}
      {evChargingSlots.length > 0 && (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            EV Charging Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evChargingSlots.map((slot) => (
              <div key={slot.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{slot.slotNumber}</div>
                    <div className="text-sm text-gray-500">{slot.floor} Floor</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    slot.chargingStatus === 'charging' ? 'bg-blue-100 text-blue-800' :
                    slot.chargingStatus === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {slot.chargingStatus?.replace('-', ' ') || 'Available'}
                  </span>
                </div>
                
                {slot.isOccupied && (
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Owner:</span> {slot.occupiedBy}</div>
                    <div><span className="font-medium">Vehicle:</span> {slot.vehicleNumber}</div>
                    {slot.timeIn && (
                      <div><span className="font-medium">Since:</span> {new Date(slot.timeIn).toLocaleString()}</div>
                    )}
                    {slot.chargingStatus === 'charging' && (
                      <div className="mt-2 bg-blue-50 p-2 rounded">
                        <div className="flex justify-between text-xs">
                          <span>Charging Progress</span>
                          <span>78%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">Est. completion: 45 min</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Parking Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Vehicle parked', slot: 'A-01', vehicle: 'MH01AB1234', time: '2 minutes ago', type: 'park' },
            { action: 'EV charging started', slot: 'EV-01', vehicle: 'MH03EF9012', time: '15 minutes ago', type: 'charge' },
            { action: 'Vehicle departed', slot: 'V-03', vehicle: 'MH02CD5678', time: '1 hour ago', type: 'depart' },
            { action: 'Charging completed', slot: 'EV-02', vehicle: 'MH04GH3456', time: '2 hours ago', type: 'complete' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'park' ? 'bg-green-100 text-green-600' :
                  activity.type === 'charge' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'complete' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'park' && <Car className="h-4 w-4" />}
                  {activity.type === 'charge' && <Zap className="h-4 w-4" />}
                  {activity.type === 'complete' && <CircleCheck className="h-4 w-4" />}
                  {activity.type === 'depart' && <Clock className="h-4 w-4" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-500">Slot {activity.slot} • {activity.vehicle}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}