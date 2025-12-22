import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, Loader as Loader2, Smartphone, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { login, loginWithProvider, loginWithOTP, isLoading } = useAuth();

  const sampleLogins = [
    { email: 'admin@vms.com', password: 'admin123', role: 'Admin', phone: '+1234567890' },
    { email: 'resident@vms.com', password: 'resident123', role: 'Resident', phone: '+1234567891' },
    { email: 'security@vms.com', password: 'security123', role: 'Security', phone: '+1234567892' },
    { email: 'facility@vms.com', password: 'facility123', role: 'Facility Manager', phone: '+1234567893' },
    { email: 'visitor@vms.com', password: 'visitor123', role: 'Visitor', phone: '+1234567894' }
  ];

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials. Please try the sample logins below.');
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpSent) {
      // Simulate sending OTP
      setOtpSent(true);
      return;
    }
    
    try {
      await loginWithOTP(phone, otp);
    } catch (err) {
      setError('Invalid OTP. Use 123456 for demo.');
    }
  };

  const handleProviderLogin = async (provider: 'google' | 'microsoft' | 'apple') => {
    try {
      await loginWithProvider(provider);
    } catch (err) {
      setError('Provider login failed. Please try again.');
    }
  };

  const handleSampleLogin = (sampleEmail: string, samplePassword: string, samplePhone: string) => {
    if (loginMethod === 'email') {
      setEmail(sampleEmail);
      setPassword(samplePassword);
    } else {
      setPhone(samplePhone);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <div className="flex justify-center">
            <div className="relative">
              <Shield className="h-16 w-16 text-indigo-600" />
              <div className="absolute -top-1 -right-1 bg-green-500 h-4 w-4 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">2</span>
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Residential VMS 2.0
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Advanced Visitor Management System
          </p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginMethod === 'email'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Mail className="h-4 w-4 inline mr-2" />
            Email Login
          </button>
          <button
            onClick={() => setLoginMethod('otp')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginMethod === 'otp'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Smartphone className="h-4 w-4 inline mr-2" />
            OTP Login
          </button>
        </div>

        {/* Email Login Form */}
        {loginMethod === 'email' && (
          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-12 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading && <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                Sign in with Email
              </button>
            </div>
          </form>
        )}

        {/* OTP Login Form */}
        {loginMethod === 'otp' && (
          <form className="mt-8 space-y-6" onSubmit={handleOTPLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="sr-only">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="appearance-none relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Phone number (+1234567890)"
                  />
                </div>
              </div>
              
              {otpSent && (
                <div>
                  <label htmlFor="otp" className="sr-only">OTP</label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-lg tracking-widest"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                  <p className="mt-2 text-sm text-gray-600 text-center">
                    Use <span className="font-mono font-bold">123456</span> for demo
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading && <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                {otpSent ? 'Verify OTP' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => handleProviderLogin('google')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            <button
              onClick={() => handleProviderLogin('microsoft')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#f25022" d="M1 1h10v10H1z"/>
                <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                <path fill="#7fba00" d="M1 13h10v10H1z"/>
                <path fill="#ffb900" d="M13 13h10v10H13z"/>
              </svg>
            </button>

            <button
              onClick={() => handleProviderLogin('apple')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600 text-sm text-center">{error}</div>
          </div>
        )}

        {/* Sample Credentials */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-900 text-center mb-4">
            Demo Credentials
          </h3>
          <div className="space-y-2">
            {sampleLogins.map((sample, index) => (
              <button
                key={index}
                onClick={() => handleSampleLogin(sample.email, sample.password, sample.phone)}
                className="w-full text-left p-3 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">{sample.role}</div>
                    <div className="text-gray-600">
                      {loginMethod === 'email' ? `${sample.email} / ${sample.password}` : sample.phone}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    sample.role === 'Admin' ? 'bg-red-100 text-red-800' :
                    sample.role === 'Security' ? 'bg-blue-100 text-blue-800' :
                    sample.role === 'Facility Manager' ? 'bg-purple-100 text-purple-800' :
                    sample.role === 'Resident' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sample.role}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">New in Version 2.0</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>• AI-Powered Insights</div>
            <div>• Smart Parking</div>
            <div>• Biometric Access</div>
            <div>• Digital Payments</div>
            <div>• Staff Management</div>
            <div>• Community Features</div>
          </div>
        </div>
      </div>
    </div>
  );
}