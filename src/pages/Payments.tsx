import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { CreditCard, Calendar, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle, Download, Plus, Search, ListFilter as Filter, Smartphone, Building, Car, Zap } from 'lucide-react';

export default function Payments() {
  const { user } = useAuth();
  const { payments, updatePayment } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: CreditCard },
    { id: 'bills', name: 'My Bills', icon: Building },
    { id: 'history', name: 'Payment History', icon: Calendar },
    { id: 'autopay', name: 'Auto-Pay Setup', icon: Smartphone }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    const matchesUser = user?.role === 'admin' || payment.userId === user?.id;
    return matchesSearch && matchesFilter && matchesUser;
  });

  const totalDue = filteredPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaid = filteredPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const overdue = filteredPayments.filter(p => 
    p.status === 'pending' && new Date(p.dueDate) < new Date()
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return Building;
      case 'amenity': return Building;
      case 'parking': return Car;
      case 'utility': return Zap;
      case 'fine': return AlertCircle;
      default: return CreditCard;
    }
  };

  const handlePayment = (paymentId: string, method: string) => {
    updatePayment(paymentId, {
      status: 'paid',
      paymentMethod: method as any,
      paidDate: new Date().toISOString(),
      transactionId: `TXN${Date.now()}`
    });
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-red-50 text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Due</div>
              <div className="text-2xl font-semibold text-gray-900">₹{totalDue.toLocaleString()}</div>
              <div className="text-sm text-red-600">{overdue} overdue</div>
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
              <div className="text-sm font-medium text-gray-500">Paid This Month</div>
              <div className="text-2xl font-semibold text-gray-900">₹{totalPaid.toLocaleString()}</div>
              <div className="text-sm text-green-600">On time</div>
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
              <div className="text-sm font-medium text-gray-500">Next Due Date</div>
              <div className="text-2xl font-semibold text-gray-900">Jan 31</div>
              <div className="text-sm text-blue-600">5 days left</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                <Smartphone className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Auto-Pay Status</div>
              <div className="text-2xl font-semibold text-gray-900">Active</div>
              <div className="text-sm text-purple-600">UPI enabled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
            <div className="text-center">
              <CreditCard className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Pay All Dues</span>
              <span className="block text-xs text-gray-500">₹{totalDue.toLocaleString()}</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
            <div className="text-center">
              <Download className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Download Receipt</span>
              <span className="block text-xs text-gray-500">Latest payment</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
            <div className="text-center">
              <Smartphone className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Setup Auto-Pay</span>
              <span className="block text-xs text-gray-500">Never miss a payment</span>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {filteredPayments.slice(0, 5).map((payment) => {
            const TypeIcon = getTypeIcon(payment.type);
            return (
              <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <TypeIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{payment.description}</div>
                    <div className="text-sm text-gray-500">
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                      {payment.paidDate && ` • Paid: ${new Date(payment.paidDate).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString()}</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderBills = () => (
    <div className="space-y-4">
      {filteredPayments.filter(p => p.status === 'pending').map((payment) => {
        const TypeIcon = getTypeIcon(payment.type);
        const isOverdue = new Date(payment.dueDate) < new Date();
        
        return (
          <div key={payment.id} className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
            isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                  <TypeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{payment.description}</h3>
                  <div className="text-sm text-gray-500">
                    Due: {new Date(payment.dueDate).toLocaleDateString()}
                    {isOverdue && <span className="text-red-600 font-medium ml-2">OVERDUE</span>}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">₹{payment.amount.toLocaleString()}</div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isOverdue ? 'Overdue' : 'Pending'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Type: <span className="capitalize">{payment.type}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedPayment(payment);
                    setShowPaymentModal(true);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isOverdue 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Pay Now
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  View Details
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderHistory = () => (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
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
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        {React.createElement(getTypeIcon(payment.type), { className: "h-4 w-4 text-gray-600" })}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{payment.description}</div>
                      <div className="text-sm text-gray-500 capitalize">{payment.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₹{payment.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(payment.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {payment.paymentMethod || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    <Download className="h-4 w-4" />
                  </button>
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowPaymentModal(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAutoPay = () => (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Auto-Pay Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Maintenance Fees</div>
                <div className="text-sm text-gray-500">Auto-pay enabled via UPI</div>
              </div>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">Configure</button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Amenity Charges</div>
                <div className="text-sm text-gray-500">Manual payment required</div>
              </div>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">Enable</button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Parking Fees</div>
                <div className="text-sm text-gray-500">Manual payment required</div>
              </div>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">Enable</button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">UPI - user@paytm</div>
                <div className="text-sm text-gray-500">Primary payment method</div>
              </div>
            </div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">**** **** **** 1234</div>
                <div className="text-sm text-gray-500">Visa ending in 1234</div>
              </div>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">Edit</button>
          </div>
          
          <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
            <Plus className="h-5 w-5 mx-auto mb-1" />
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payments & Billing</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your payments, bills, and auto-pay settings.
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Download Statement
        </button>
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
      {(activeTab === 'bills' || activeTab === 'history') && (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'bills' && renderBills()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'autopay' && renderAutoPay()}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Make Payment</h3>
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">Payment for</div>
              <div className="font-medium text-gray-900">{selectedPayment.description}</div>
              <div className="text-2xl font-bold text-gray-900 mt-2">₹{selectedPayment.amount.toLocaleString()}</div>
            </div>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handlePayment(selectedPayment.id, 'upi')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <span>UPI Payment</span>
                </div>
                <span className="text-sm text-gray-500">Instant</span>
              </button>
              
              <button
                onClick={() => handlePayment(selectedPayment.id, 'card')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <span>Credit/Debit Card</span>
                </div>
                <span className="text-sm text-gray-500">Secure</span>
              </button>
              
              <button
                onClick={() => handlePayment(selectedPayment.id, 'bank-transfer')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-green-600" />
                  <span>Bank Transfer</span>
                </div>
                <span className="text-sm text-gray-500">1-2 days</span>
              </button>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPayment(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}