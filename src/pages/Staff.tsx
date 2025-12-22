import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Users, Shield, Wrench, UserCheck, Calendar, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, MapPin, Plus, Search, ListFilter as Filter, Star, Phone, Mail } from 'lucide-react';
import AddStaffModal from '../components/Staff/AddStaffModal';

export default function Staff() {
  const { user } = useAuth();
  const { staffMembers, domesticStaff } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffTypeToAdd, setStaffTypeToAdd] = useState<'facility' | 'domestic'>('facility');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Users },
    { id: 'security', name: 'Security Staff', icon: Shield },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench },
    { id: 'domestic', name: 'Domestic Staff', icon: UserCheck },
    { id: 'tasks', name: 'Tasks & Shifts', icon: Calendar }
  ];

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.phone.includes(searchTerm) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || staff.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredDomesticStaff = domesticStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.phone.includes(searchTerm) ||
                         staff.employerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterRole === 'all' || staff.type === filterRole;
    return matchesSearch && matchesType;
  });

  const onDutyStaff = staffMembers.filter(s => s.isOnDuty).length;
  const totalTasks = staffMembers.reduce((sum, s) => sum + s.tasks.length, 0);
  const completedTasks = staffMembers.reduce((sum, s) => sum + s.tasks.filter(t => t.status === 'completed').length, 0);
  const avgRating = staffMembers.reduce((sum, s) => sum + s.performance.rating, 0) / staffMembers.length;

  const handleAddStaff = (staff: any) => {
    console.log('New staff added:', staff);
    alert(`Staff member ${staff.name} has been successfully registered!`);
  };

  const openAddStaffModal = (type: 'facility' | 'domestic') => {
    setStaffTypeToAdd(type);
    setShowAddStaffModal(true);
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'morning': return 'bg-yellow-100 text-yellow-800';
      case 'evening': return 'bg-orange-100 text-orange-800';
      case 'night': return 'bg-blue-100 text-blue-800';
      case 'rotating': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Staff On Duty</div>
              <div className="text-2xl font-semibold text-gray-900">{onDutyStaff}/{staffMembers.length}</div>
              <div className="text-sm text-green-600">Active now</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Tasks Completed</div>
              <div className="text-2xl font-semibold text-gray-900">{completedTasks}/{totalTasks}</div>
              <div className="text-sm text-blue-600">{Math.round((completedTasks/totalTasks)*100)}% completion</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                <Star className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Avg Performance</div>
              <div className="text-2xl font-semibold text-gray-900">{avgRating.toFixed(1)}/5.0</div>
              <div className="text-sm text-yellow-600">Excellent rating</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Domestic Staff</div>
              <div className="text-2xl font-semibold text-gray-900">{domesticStaff.length}</div>
              <div className="text-sm text-purple-600">Registered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Shifts */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Shifts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['morning', 'evening', 'night'].map((shift) => {
            const shiftStaff = staffMembers.filter(s => s.shift === shift);
            const onDuty = shiftStaff.filter(s => s.isOnDuty).length;
            
            return (
              <div key={shift} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900 capitalize">{shift} Shift</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getShiftColor(shift)}`}>
                    {onDuty}/{shiftStaff.length} on duty
                  </span>
                </div>
                <div className="space-y-2">
                  {shiftStaff.slice(0, 3).map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">{staff.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        staff.isOnDuty ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {staff.isOnDuty ? 'On Duty' : 'Off Duty'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Security patrol completed', staff: 'David Rodriguez', time: '10 minutes ago', type: 'patrol' },
            { action: 'Maintenance task assigned', staff: 'Mike Johnson', time: '30 minutes ago', type: 'maintenance' },
            { action: 'Domestic staff check-in', staff: 'Priya Sharma', time: '1 hour ago', type: 'checkin' },
            { action: 'Emergency response completed', staff: 'David Rodriguez', time: '2 hours ago', type: 'emergency' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'patrol' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'maintenance' ? 'bg-yellow-100 text-yellow-600' :
                  activity.type === 'checkin' ? 'bg-green-100 text-green-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {activity.type === 'patrol' && <MapPin className="h-4 w-4" />}
                  {activity.type === 'maintenance' && <Wrench className="h-4 w-4" />}
                  {activity.type === 'checkin' && <UserCheck className="h-4 w-4" />}
                  {activity.type === 'emergency' && <AlertCircle className="h-4 w-4" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-500">by {activity.staff}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityStaff = () => (
    <div className="space-y-4">
      {filteredStaff.filter(s => s.role === 'security').map((staff) => (
        <div key={staff.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{staff.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {staff.phone}
                  </span>
                  <span className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {staff.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getShiftColor(staff.shift)}`}>
                {staff.shift} shift
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                staff.isOnDuty ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {staff.isOnDuty ? 'On Duty' : 'Off Duty'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{staff.performance.rating}</div>
              <div className="text-sm text-gray-500">Rating</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{staff.performance.completedTasks}</div>
              <div className="text-sm text-gray-500">Tasks Done</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{staff.performance.responseTime}m</div>
              <div className="text-sm text-gray-500">Avg Response</div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Assigned Zones</h4>
            <div className="flex flex-wrap gap-2">
              {staff.assignedZones.map((zone) => (
                <span key={zone} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {zone.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Tasks</h4>
            <div className="space-y-2">
              {staff.tasks.slice(0, 2).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-xs text-gray-500">{task.location}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDomesticStaff = () => (
    <div className="space-y-4">
      {filteredDomesticStaff.map((staff) => (
        <div key={staff.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{staff.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {staff.phone}
                  </span>
                  <span className="capitalize">{staff.type}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                staff.backgroundVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {staff.backgroundVerified ? 'Verified' : 'Pending'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                staff.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {staff.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Employer</div>
              <div className="text-sm text-gray-600">{staff.employerName} ({staff.employerApartment})</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Working Hours</div>
              <div className="text-sm text-gray-600">{staff.workingHours}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Working Days</div>
            <div className="flex flex-wrap gap-2">
              {staff.workingDays.map((day) => (
                <span key={day} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {day}
                </span>
              ))}
            </div>
          </div>

          {staff.lastAttendance && (
            <div className="text-sm text-gray-500">
              Last attendance: {new Date(staff.lastAttendance).toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-4">
      {staffMembers.flatMap(staff => 
        staff.tasks.map(task => ({ ...task, staffName: staff.name, staffRole: staff.role }))
      ).map((task) => (
        <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Assigned to:</span>
              <div className="text-gray-600">{task.staffName}</div>
            </div>
            <div>
              <span className="font-medium text-gray-900">Location:</span>
              <div className="text-gray-600">{task.location}</div>
            </div>
            <div>
              <span className="font-medium text-gray-900">Due Date:</span>
              <div className="text-gray-600">{new Date(task.dueDate).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="font-medium text-gray-900">Priority:</span>
              <div className={`capitalize ${
                task.priority === 'high' ? 'text-red-600' :
                task.priority === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {task.priority}
              </div>
            </div>
          </div>

          {task.checkpoints && task.checkpoints.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-900 mb-2">Checkpoints</div>
              <div className="flex flex-wrap gap-2">
                {task.checkpoints.map((checkpoint, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {checkpoint}
                  </span>
                ))}
              </div>
            </div>
          )}

          {task.completedAt && (
            <div className="mt-3 text-sm text-green-600">
              Completed: {new Date(task.completedAt).toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage security, maintenance, and domestic staff across the residential complex.
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'facility-manager') && (
          <div className="flex space-x-3">
            <button
              onClick={() => openAddStaffModal('facility')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Facility Staff
            </button>
            <button
              onClick={() => openAddStaffModal('domestic')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Domestic Staff
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search and Filter */}
      {activeTab !== 'overview' && (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="security">Security</option>
                <option value="maintenance">Maintenance</option>
                <option value="cleaning">Cleaning</option>
                <option value="facility-manager">Facility Manager</option>
                {activeTab === 'domestic' && (
                  <>
                    <option value="maid">Maid</option>
                    <option value="driver">Driver</option>
                    <option value="gardener">Gardener</option>
                    <option value="cook">Cook</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'security' && renderSecurityStaff()}
        {activeTab === 'maintenance' && (
          <div className="text-center py-12">
            <Wrench className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Maintenance Staff</h3>
            <p className="mt-1 text-sm text-gray-500">Maintenance staff management coming soon.</p>
          </div>
        )}
        {activeTab === 'domestic' && renderDomesticStaff()}
        {activeTab === 'tasks' && renderTasks()}
      </div>

      {showAddStaffModal && (
        <AddStaffModal
          onClose={() => setShowAddStaffModal(false)}
          onSave={handleAddStaff}
          staffType={staffTypeToAdd}
        />
      )}
    </div>
  );
}