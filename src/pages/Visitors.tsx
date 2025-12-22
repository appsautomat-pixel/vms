import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import PreRegistrationForm from '../components/Visitors/PreRegistrationForm';
import BulkRegistrationForm from '../components/Visitors/BulkRegistrationForm';
import { Users, Search, ListFilter as Filter, Plus, QrCode, Clock, CircleCheck as CheckCircle, Circle as XCircle, Car, Phone, Mail, User } from 'lucide-react';

export default function Visitors() {
  const { user } = useAuth();
  const { visitors, updateVisitor } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPreRegistrationForm, setShowPreRegistrationForm] = useState(false);
  const [showBulkRegistrationForm, setShowBulkRegistrationForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'checked-in', label: 'Checked In' },
    { value: 'checked-out', label: 'Checked Out' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.phone.includes(searchTerm) ||
                         visitor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'checked-in': return Users;
      case 'checked-out': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const handleStatusUpdate = (visitorId: string, newStatus: string) => {
    updateVisitor(visitorId, { 
      status: newStatus as any,
      checkInTime: newStatus === 'checked-in' ? new Date().toISOString() : undefined,
      checkOutTime: newStatus === 'checked-out' ? new Date().toISOString() : undefined
    });
  };

  const handlePreRegistrationSuccess = () => {
    setSuccessMessage('Visitor pre-registration submitted successfully! QR code has been sent to the visitor.');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const handleBulkRegistrationSuccess = (count: number) => {
    setSuccessMessage(`${count} visitors registered successfully! QR codes have been sent to all visitors.`);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Visitor Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage visitor registrations, approvals, and check-ins.
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'resident') && (
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPreRegistrationForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Pre-Register Visitor
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowBulkRegistrationForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Bulk Registration
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search visitors by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitor Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Host
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visit Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVisitors.map((visitor) => {
                const StatusIcon = getStatusIcon(visitor.status);
                return (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{visitor.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {visitor.phone}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {visitor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visitor.hostName}</div>
                      {visitor.vehicleNumber && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Car className="h-3 w-3 mr-1" />
                          {visitor.vehicleNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visitor.visitDate}</div>
                      <div className="text-sm text-gray-500">{visitor.visitTime}</div>
                      <div className="text-sm text-gray-500">{visitor.purpose}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(visitor.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {visitor.status === 'pending' && user?.role === 'admin' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(visitor.id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(visitor.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {visitor.status === 'approved' && user?.role === 'security' && (
                        <button
                          onClick={() => handleStatusUpdate(visitor.id, 'checked-in')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Check In
                        </button>
                      )}
                      {visitor.status === 'checked-in' && user?.role === 'security' && (
                        <button
                          onClick={() => handleStatusUpdate(visitor.id, 'checked-out')}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Check Out
                        </button>
                      )}
                      <button
                        onClick={() => alert(`QR Code: ${visitor.qrCode}`)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredVisitors.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No visitors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No visitors match your current search and filter criteria.
          </p>
        </div>
      )}

      {/* Pre-Registration Form Modal */}
      {showPreRegistrationForm && (
        <PreRegistrationForm
          onClose={() => setShowPreRegistrationForm(false)}
          onSuccess={handlePreRegistrationSuccess}
        />
      )}

      {/* Bulk Registration Form Modal */}
      {showBulkRegistrationForm && (
        <BulkRegistrationForm
          onClose={() => setShowBulkRegistrationForm(false)}
          onSuccess={handleBulkRegistrationSuccess}
        />
      )}
    </div>
  );
}