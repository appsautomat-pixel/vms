import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Visitors from './pages/Visitors';
import Amenities from './pages/Amenities';
import Emergency from './pages/Emergency';
import Analytics from './pages/Analytics';
import Parking from './pages/Parking';
import Community from './pages/Community';
import Payments from './pages/Payments';
import Staff from './pages/Staff';
import AIInsights from './pages/AIInsights';
import BulkOperations from './pages/BulkOperations';
import SystemSettings from './pages/SystemSettings';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:pl-72">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/visitors" element={<Visitors />} />
              <Route path="/visitors/*" element={<Visitors />} />
              <Route path="/amenities" element={<Amenities />} />
              <Route path="/amenities/*" element={<Amenities />} />
              <Route path="/parking" element={<Parking />} />
              <Route path="/parking/*" element={<Parking />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/*" element={<Community />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/payments/*" element={<Payments />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/staff/*" element={<Staff />} />
              <Route path="/analytics/ai-insights" element={<AIInsights />} />
              <Route path="/rooftop" element={<Amenities />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/checkin" element={<Visitors />} />
              <Route path="/invite" element={<Visitors />} />
              <Route path="/bookings" element={<Amenities />} />
              <Route path="/visits" element={<Visitors />} />
              <Route path="/vehicles" element={<Parking />} />
              <Route path="/bulk-registration" element={<div className="text-center py-12"><h2>Bulk Registration - Coming Soon</h2></div>} />
              <Route path="/bulk-operations" element={<BulkOperations />} />
              <Route path="/security" element={<div className="text-center py-12"><h2>Security Management - Coming Soon</h2></div>} />
              <Route path="/settings" element={<SystemSettings />} />
              <Route path="/profile" element={<div className="text-center py-12"><h2>Profile Settings - Coming Soon</h2></div>} />
              <Route path="/maintenance" element={<div className="text-center py-12"><h2>Maintenance Management - Coming Soon</h2></div>} />
              <Route path="/patrol" element={<div className="text-center py-12"><h2>Patrol Management - Coming Soon</h2></div>} />
              <Route path="/communication" element={<div className="text-center py-12"><h2>Communication Center - Coming Soon</h2></div>} />
              <Route path="/complaints" element={<Community />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;