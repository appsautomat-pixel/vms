import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: 'google' | 'microsoft' | 'apple') => Promise<void>;
  loginWithOTP: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced sample users with complete profiles
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'admin@vms.com',
    phone: '+1234567890',
    role: 'admin',
    profileComplete: true,
    biometricEnabled: true,
    nfcEnabled: true,
    lastLogin: new Date().toISOString(),
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'resident@vms.com',
    phone: '+1234567891',
    role: 'resident',
    apartmentNo: 'A-101',
    profileComplete: true,
    biometricEnabled: false,
    nfcEnabled: true,
    lastLogin: new Date(Date.now() - 3600000).toISOString(),
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'David Rodriguez',
    email: 'security@vms.com',
    phone: '+1234567892',
    role: 'security',
    profileComplete: true,
    biometricEnabled: true,
    nfcEnabled: false,
    lastLogin: new Date(Date.now() - 1800000).toISOString(),
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'facility@vms.com',
    phone: '+1234567893',
    role: 'facility-manager',
    profileComplete: true,
    biometricEnabled: false,
    nfcEnabled: true,
    lastLogin: new Date(Date.now() - 7200000).toISOString(),
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '5',
    name: 'Alex Thompson',
    email: 'visitor@vms.com',
    phone: '+1234567894',
    role: 'visitor',
    profileComplete: true,
    biometricEnabled: false,
    nfcEnabled: false,
    lastLogin: new Date(Date.now() - 14400000).toISOString(),
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('vms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const foundUser = sampleUsers.find(u => u.email === email);
      if (foundUser) {
        const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
        setUser(updatedUser);
        localStorage.setItem('vms_user', JSON.stringify(updatedUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithProvider = async (provider: 'google' | 'microsoft' | 'apple') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate OAuth login - use first user as example
      const user = { ...sampleUsers[0], lastLogin: new Date().toISOString() };
      setUser(user);
      localStorage.setItem('vms_user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOTP = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const foundUser = sampleUsers.find(u => u.phone === phone);
      if (foundUser && otp === '123456') {
        const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
        setUser(updatedUser);
        localStorage.setItem('vms_user', JSON.stringify(updatedUser));
      } else {
        throw new Error('Invalid OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vms_user');
  };

  const register = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'resident',
        apartmentNo: userData.apartmentNo,
        guardianId: userData.guardianId,
        profileComplete: false,
        biometricEnabled: false,
        nfcEnabled: false,
        lastLogin: new Date().toISOString()
      };
      setUser(newUser);
      localStorage.setItem('vms_user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('vms_user', JSON.stringify(updatedUser));
    }
  };

  const verifyOTP = async (otp: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // OTP verification logic
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginWithProvider,
      loginWithOTP,
      logout,
      register,
      verifyOTP,
      updateProfile,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}