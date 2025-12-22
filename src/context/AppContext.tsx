import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Visitor, Amenity, Booking, EmergencyAlert, Analytics, DomesticStaff, ParkingSlot, Complaint, Notice, Payment, AIInsight, StaffMember } from '../types';

interface AppContextType {
  visitors: Visitor[];
  amenities: Amenity[];
  bookings: Booking[];
  emergencyAlerts: EmergencyAlert[];
  analytics: Analytics;
  domesticStaff: DomesticStaff[];
  parkingSlots: ParkingSlot[];
  complaints: Complaint[];
  notices: Notice[];
  payments: Payment[];
  aiInsights: AIInsight[];
  staffMembers: StaffMember[];
  addVisitor: (visitor: Omit<Visitor, 'id'>) => void;
  updateVisitor: (id: string, updates: Partial<Visitor>) => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  updateAmenity: (id: string, updates: Partial<Amenity>) => void;
  deleteAmenity: (id: string) => void;
  triggerEmergency: (alert: Omit<EmergencyAlert, 'id'>) => void;
  acknowledgeAlert: (alertId: string, userId: string) => void;
  addComplaint: (complaint: Omit<Complaint, 'id'>) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  addDomesticStaff: (staff: Omit<DomesticStaff, 'id'>) => void;
  updateParkingSlot: (id: string, updates: Partial<ParkingSlot>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Enhanced sample data with realistic information
const sampleAmenities: Amenity[] = [
  // Ground Floor Amenities
  { 
    id: 'amen-gf-01', 
    name: 'Music Room', 
    code: 'AMEN-GF-01', 
    location: 'ground-floor', 
    type: 'reservation', 
    capacity: 10, 
    currentOccupancy: 3, 
    isAvailable: true,
    maintenanceStatus: 'operational',
    lastCleaned: '2025-01-20T08:00:00Z',
    nextMaintenance: '2025-02-15T10:00:00Z',
    equipment: ['Piano', 'Guitar', 'Drums', 'Microphones', 'Sound System'],
    rules: ['No food or drinks', 'Maximum 2 hours per session', 'Clean up after use']
  },
  { 
    id: 'amen-gf-02', 
    name: 'Cinema Hall', 
    code: 'AMEN-GF-02', 
    location: 'ground-floor', 
    type: 'reservation', 
    capacity: 50, 
    currentOccupancy: 15, 
    isAvailable: true,
    requiresPayment: true,
    pricePerHour: 25,
    maintenanceStatus: 'operational',
    lastCleaned: '2025-01-20T06:00:00Z',
    equipment: ['Projector', 'Sound System', 'Recliner Seats', 'Air Conditioning'],
    rules: ['No outside food', 'Advance booking required', 'Minimum 10 people for private screening']
  },
  { 
    id: 'amen-gf-03', 
    name: 'Fitness Gym', 
    code: 'AMEN-GF-03', 
    location: 'ground-floor', 
    type: 'reservation', 
    capacity: 25, 
    currentOccupancy: 18, 
    isAvailable: true,
    maintenanceStatus: 'operational',
    equipment: ['Treadmills', 'Weight Machines', 'Free Weights', 'Yoga Mats', 'Cardio Equipment'],
    rules: ['Towel mandatory', 'Proper gym attire required', '90 minutes maximum per session']
  },
  { 
    id: 'amen-gf-04', 
    name: 'Social Hall', 
    code: 'AMEN-GF-04', 
    location: 'ground-floor', 
    type: 'reservation', 
    capacity: 100, 
    currentOccupancy: 0, 
    isAvailable: true, 
    requiresApproval: true,
    requiresPayment: true,
    pricePerHour: 100,
    maintenanceStatus: 'operational',
    equipment: ['Stage', 'Sound System', 'Tables', 'Chairs', 'Kitchen Access'],
    rules: ['Admin approval required', 'Security deposit needed', 'Event insurance mandatory']
  },
  { 
    id: 'amen-gf-05', 
    name: 'Children Play Room', 
    code: 'AMEN-GF-05', 
    location: 'ground-floor', 
    type: 'monitoring', 
    capacity: 20, 
    currentOccupancy: 8, 
    isAvailable: true, 
    requiresGuardian: true,
    maintenanceStatus: 'operational',
    equipment: ['Soft Play Equipment', 'Toys', 'Books', 'Art Supplies', 'Safety Mats'],
    rules: ['Guardian supervision mandatory', 'Age limit: 2-12 years', 'Clean hands before entry']
  },
  { 
    id: 'amen-gf-06', 
    name: 'Snooker Room', 
    code: 'AMEN-GF-06', 
    location: 'ground-floor', 
    type: 'reservation', 
    capacity: 8, 
    currentOccupancy: 4, 
    isAvailable: true,
    requiresPayment: true,
    pricePerHour: 15,
    maintenanceStatus: 'operational',
    equipment: ['2 Snooker Tables', 'Cues', 'Balls', 'Scoreboard', 'Seating Area'],
    rules: ['Maximum 4 players per table', 'Proper cue handling', 'No drinks near tables']
  },
  { 
    id: 'amen-gf-07', 
    name: 'Library & Reading Room', 
    code: 'AMEN-GF-07', 
    location: 'ground-floor', 
    type: 'open-access', 
    capacity: 30, 
    currentOccupancy: 12, 
    isAvailable: true,
    maintenanceStatus: 'operational',
    equipment: ['Books', 'Study Tables', 'Computers', 'Printers', 'WiFi'],
    rules: ['Silence mandatory', 'No food allowed', 'Return books within 14 days']
  },
  { 
    id: 'amen-gf-08', 
    name: 'Swimming Pool', 
    code: 'AMEN-GF-08', 
    location: 'ground-floor', 
    type: 'reservation', 
    capacity: 40, 
    currentOccupancy: 22, 
    isAvailable: true,
    requiresPayment: true,
    pricePerHour: 20,
    maintenanceStatus: 'operational',
    equipment: ['Pool', 'Lifeguard Chair', 'Pool Equipment', 'Changing Rooms', 'Showers'],
    rules: ['Swimming attire mandatory', 'Children under 12 need supervision', 'No diving in shallow end']
  },

  // Rooftop Closed Access Amenities
  { 
    id: 'amen-rt-c-01', 
    name: 'Rooftop Children Area', 
    code: 'AMEN-RT-C-01', 
    location: 'rooftop-closed', 
    type: 'monitoring', 
    capacity: 15, 
    currentOccupancy: 7, 
    isAvailable: true, 
    requiresGuardian: true,
    maintenanceStatus: 'operational',
    equipment: ['Playground Equipment', 'Safety Barriers', 'Shade Structures', 'Seating'],
    rules: ['Guardian supervision required', 'Age appropriate equipment use', 'Weather dependent access']
  },
  { 
    id: 'amen-rt-c-02', 
    name: 'Table Tennis Arena', 
    code: 'AMEN-RT-C-02', 
    location: 'rooftop-closed', 
    type: 'reservation', 
    capacity: 8, 
    currentOccupancy: 4, 
    isAvailable: true,
    requiresPayment: true,
    pricePerHour: 10,
    maintenanceStatus: 'operational',
    equipment: ['4 Table Tennis Tables', 'Paddles', 'Balls', 'Net', 'Scoreboard'],
    rules: ['Maximum 1 hour per booking', 'Proper sports attire', 'Equipment care required']
  },
  { 
    id: 'amen-rt-c-03', 
    name: 'Badminton Court', 
    code: 'AMEN-RT-C-03', 
    location: 'rooftop-closed', 
    type: 'reservation', 
    capacity: 12, 
    currentOccupancy: 6, 
    isAvailable: true,
    requiresPayment: true,
    pricePerHour: 30,
    maintenanceStatus: 'operational',
    equipment: ['2 Badminton Courts', 'Nets', 'Rackets', 'Shuttlecocks', 'Seating'],
    rules: ['Court shoes mandatory', 'Maximum 4 players per court', 'Advance booking required']
  },
  { 
    id: 'amen-rt-c-04', 
    name: 'Open Air Cinema', 
    code: 'AMEN-RT-C-04', 
    location: 'rooftop-closed', 
    type: 'reservation', 
    capacity: 60, 
    currentOccupancy: 25, 
    isAvailable: true,
    requiresPayment: true,
    pricePerHour: 50,
    maintenanceStatus: 'operational',
    equipment: ['Large Screen', 'Projector', 'Sound System', 'Seating', 'Weather Protection'],
    rules: ['Weather dependent', 'Community events priority', 'No outside food during paid events']
  },

  // Rooftop Open Access Amenities
  { 
    id: 'amen-rt-o-01', 
    name: 'Jogging Track', 
    code: 'AMEN-RT-O-01', 
    location: 'rooftop-open', 
    type: 'open-access', 
    capacity: 20, 
    currentOccupancy: 8, 
    isAvailable: true,
    maintenanceStatus: 'operational',
    equipment: ['Marked Track', 'Distance Markers', 'Water Stations', 'Rest Benches'],
    rules: ['Jogging direction clockwise', 'No cycling allowed', 'Maintain social distance']
  },
  { 
    id: 'amen-rt-o-02', 
    name: 'Refreshment Bar', 
    code: 'AMEN-RT-O-02', 
    location: 'rooftop-open', 
    type: 'open-access', 
    capacity: 15, 
    currentOccupancy: 5, 
    isAvailable: true,
    requiresPayment: true,
    maintenanceStatus: 'operational',
    equipment: ['Refrigerator', 'Seating', 'Tables', 'Vending Machines'],
    rules: ['Self-service', 'Clean up after use', 'Operating hours: 6 AM - 10 PM']
  },
  { 
    id: 'amen-rt-o-03', 
    name: 'Garden Seating Area', 
    code: 'AMEN-RT-O-03', 
    location: 'rooftop-open', 
    type: 'open-access', 
    capacity: 12, 
    currentOccupancy: 3, 
    isAvailable: true,
    maintenanceStatus: 'operational',
    equipment: ['Garden Furniture', 'Umbrellas', 'Plants', 'Lighting'],
    rules: ['Quiet zone', 'No loud music', 'Respect plant life']
  },
  { 
    id: 'amen-rt-o-04', 
    name: 'BBQ & Grilling Area', 
    code: 'AMEN-RT-O-04', 
    location: 'rooftop-open', 
    type: 'reservation', 
    capacity: 16, 
    currentOccupancy: 0, 
    isAvailable: true,
    requiresPayment: true,
    pricePerHour: 40,
    maintenanceStatus: 'operational',
    equipment: ['BBQ Grills', 'Tables', 'Chairs', 'Utensils', 'Fire Safety Equipment'],
    rules: ['Fire safety training required', 'Clean grills after use', 'No unattended cooking']
  },
  {
    id: 'amen-rt-o-05',
    name: 'Meditation Garden',
    code: 'AMEN-RT-O-05',
    location: 'rooftop-open',
    type: 'reservation',
    capacity: 12,
    currentOccupancy: 3,
    isAvailable: true,
    maintenanceStatus: 'operational',
    equipment: ['Meditation Mats', 'Sound System', 'Plants', 'Water Feature'],
    rules: ['Silence mandatory', 'Remove shoes', 'Peaceful environment only']
  },

  // New Amenities
  {
    id: 'amen-gf-09',
    name: "Men's Washroom",
    code: 'WASH-M-01',
    location: 'ground-floor',
    type: 'open-access',
    capacity: 5,
    currentOccupancy: 1,
    isAvailable: true,
    maintenanceStatus: 'operational',
    lastCleaned: '2025-01-20T14:00:00Z',
    equipment: ['Hand Dryers', 'Soap Dispensers', 'Mirror', 'Tissue Holders'],
    rules: ['Keep clean', 'Report maintenance issues', 'No smoking']
  },
  {
    id: 'amen-gf-10',
    name: "Women's Washroom",
    code: 'WASH-W-01',
    location: 'ground-floor',
    type: 'open-access',
    capacity: 5,
    currentOccupancy: 2,
    isAvailable: true,
    maintenanceStatus: 'operational',
    lastCleaned: '2025-01-20T14:00:00Z',
    equipment: ['Hand Dryers', 'Soap Dispensers', 'Mirror', 'Tissue Holders', 'Sanitary Disposal'],
    rules: ['Keep clean', 'Report maintenance issues', 'No smoking']
  },
  {
    id: 'amen-rt-o-06',
    name: 'Sitting Area-2',
    code: 'SEAT-02',
    location: 'rooftop-open',
    type: 'open-access',
    capacity: 20,
    currentOccupancy: 5,
    isAvailable: true,
    maintenanceStatus: 'operational',
    equipment: ['Benches', 'Tables', 'Umbrellas', 'Planters'],
    rules: ['No loud music', 'Keep area clean', 'Respect other residents']
  },
  {
    id: 'amen-rt-o-07',
    name: 'Round Sitting Area',
    code: 'SEAT-ROUND-01',
    location: 'rooftop-open',
    type: 'open-access',
    capacity: 15,
    currentOccupancy: 3,
    isAvailable: true,
    maintenanceStatus: 'operational',
    equipment: ['Circular Seating', 'Center Table', 'Lighting', 'Planters'],
    rules: ['No loud conversations', 'Keep area tidy', 'Evening hours: 6 PM - 10 PM']
  },
  {
    id: 'amen-rt-o-08',
    name: 'Basketball Hoop',
    code: 'BASKET-01',
    location: 'rooftop-open',
    type: 'open-access',
    capacity: 10,
    currentOccupancy: 4,
    isAvailable: true,
    maintenanceStatus: 'operational',
    equipment: ['Basketball Hoop', 'Court Markings', 'Lighting', 'Seating Area'],
    rules: ['Proper sports shoes required', 'Maximum 30 minutes if others waiting', 'No dunking', 'Report damaged equipment']
  },
  {
    id: 'amen-rt-o-09',
    name: 'Service Room',
    code: 'SERVICE-01',
    location: 'rooftop-open',
    type: 'open-access',
    capacity: 3,
    currentOccupancy: 0,
    isAvailable: true,
    maintenanceStatus: 'operational',
    equipment: ['Storage Shelves', 'Cleaning Supplies', 'Tools', 'Utility Sink'],
    rules: ['Staff access priority', 'Return tools after use', 'Report missing items', 'Keep organized']
  }
];

const sampleVisitors: Visitor[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    phone: '+1234567894',
    email: 'alice.johnson@email.com',
    idNumber: 'DL12345678',
    purpose: 'Social Visit',
    hostId: '2',
    hostName: 'Michael Chen',
    hostApartment: 'A-101',
    visitDate: '2025-01-20',
    visitTime: '14:00',
    status: 'checked-in',
    qrCode: 'QR123456789',
    checkInTime: '2025-01-20T14:15:00Z',
    validUntil: '2025-01-20T20:00:00Z',
    accessZones: ['ground-floor', 'rooftop-open'],
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Robert Smith',
    phone: '+1234567895',
    email: 'robert.smith@email.com',
    idNumber: 'ID67890123',
    purpose: 'Food Delivery',
    hostId: '2',
    hostName: 'Michael Chen',
    hostApartment: 'A-101',
    visitDate: '2025-01-20',
    visitTime: '16:30',
    status: 'approved',
    qrCode: 'QR789012345',
    vehicleNumber: 'ABC123',
    deliveryType: 'food',
    vendorType: 'zomato',
    validUntil: '2025-01-20T17:00:00Z',
    assets: ['Food Package'],
    photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Maria Garcia',
    phone: '+1234567896',
    email: 'maria.garcia@email.com',
    idNumber: 'ID45678901',
    purpose: 'Maintenance Service',
    hostId: '1',
    hostName: 'Sarah Johnson',
    hostApartment: 'B-205',
    visitDate: '2025-01-20',
    visitTime: '10:00',
    status: 'completed',
    qrCode: 'QR345678901',
    checkInTime: '2025-01-20T10:05:00Z',
    checkOutTime: '2025-01-20T12:30:00Z',
    validUntil: '2025-01-20T15:00:00Z',
    assets: ['Toolbox', 'Spare Parts'],
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

const sampleDomesticStaff: DomesticStaff[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    phone: '+1234567897',
    type: 'maid',
    employerId: '2',
    employerName: 'Michael Chen',
    employerApartment: 'A-101',
    workingDays: ['Monday', 'Wednesday', 'Friday'],
    workingHours: '09:00-12:00',
    isActive: true,
    lastAttendance: '2025-01-20T09:15:00Z',
    backgroundVerified: true,
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    phone: '+1234567898',
    type: 'driver',
    employerId: '1',
    employerName: 'Sarah Johnson',
    employerApartment: 'B-205',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '08:00-18:00',
    isActive: true,
    lastAttendance: '2025-01-20T08:00:00Z',
    backgroundVerified: true,
    photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

const sampleParkingSlots: ParkingSlot[] = [
  { id: '1', slotNumber: 'A-01', type: 'resident', isOccupied: true, occupiedBy: 'Michael Chen', vehicleNumber: 'MH01AB1234', timeIn: '2025-01-20T08:00:00Z', floor: 'Ground', zone: 'A' },
  { id: '2', slotNumber: 'A-02', type: 'resident', isOccupied: false, floor: 'Ground', zone: 'A' },
  { id: '3', slotNumber: 'V-01', type: 'visitor', isOccupied: true, occupiedBy: 'Alice Johnson', vehicleNumber: 'MH02CD5678', timeIn: '2025-01-20T14:15:00Z', floor: 'Ground', zone: 'V' },
  { id: '4', slotNumber: 'EV-01', type: 'ev-charging', isOccupied: true, occupiedBy: 'Sarah Johnson', vehicleNumber: 'MH03EF9012', timeIn: '2025-01-20T10:00:00Z', floor: 'Basement', zone: 'EV', isEVCharging: true, chargingStatus: 'charging' }
];

const sampleComplaints: Complaint[] = [
  {
    id: '1',
    title: 'Gym Equipment Malfunction',
    description: 'The treadmill in the gym is making unusual noises and stops suddenly.',
    category: 'maintenance',
    priority: 'high',
    status: 'in-progress',
    reportedBy: 'Michael Chen',
    reporterApartment: 'A-101',
    assignedTo: 'Emily Davis',
    createdAt: '2025-01-19T10:30:00Z',
    updatedAt: '2025-01-20T09:00:00Z',
    comments: [
      { id: '1', text: 'Technician scheduled for tomorrow', author: 'Emily Davis', timestamp: '2025-01-20T09:00:00Z', type: 'update' }
    ]
  },
  {
    id: '2',
    title: 'Noise Complaint - Late Night Music',
    description: 'Loud music from apartment B-301 disturbing sleep after 11 PM.',
    category: 'noise',
    priority: 'medium',
    status: 'resolved',
    reportedBy: 'Sarah Johnson',
    reporterApartment: 'B-205',
    createdAt: '2025-01-18T23:15:00Z',
    updatedAt: '2025-01-19T08:00:00Z',
    resolvedAt: '2025-01-19T08:00:00Z',
    comments: [
      { id: '2', text: 'Spoke with resident, issue resolved', author: 'David Rodriguez', timestamp: '2025-01-19T08:00:00Z', type: 'resolution' }
    ]
  }
];

const sampleNotices: Notice[] = [
  {
    id: '1',
    title: 'Swimming Pool Maintenance',
    content: 'The swimming pool will be closed for maintenance from January 25-27, 2025. We apologize for any inconvenience.',
    type: 'maintenance',
    priority: 'high',
    publishedBy: 'Emily Davis',
    publishedAt: '2025-01-20T08:00:00Z',
    expiresAt: '2025-01-28T00:00:00Z',
    targetAudience: 'all',
    isActive: true,
    readBy: ['2', '3']
  },
  {
    id: '2',
    title: 'Community Holi Celebration',
    content: 'Join us for the annual Holi celebration on March 15, 2025, at the Social Hall. Food and colors will be provided.',
    type: 'event',
    priority: 'medium',
    publishedBy: 'Sarah Johnson',
    publishedAt: '2025-01-19T15:00:00Z',
    expiresAt: '2025-03-16T00:00:00Z',
    targetAudience: 'residents',
    isActive: true,
    readBy: ['1', '2', '4']
  }
];

const samplePayments: Payment[] = [
  {
    id: '1',
    type: 'maintenance',
    amount: 5000,
    description: 'Monthly maintenance fee - January 2025',
    dueDate: '2025-01-31',
    status: 'paid',
    paymentMethod: 'upi',
    transactionId: 'TXN123456789',
    paidDate: '2025-01-15',
    userId: '2',
    userApartment: 'A-101'
  },
  {
    id: '2',
    type: 'amenity',
    amount: 500,
    description: 'Social Hall booking - Birthday party',
    dueDate: '2025-01-25',
    status: 'pending',
    userId: '1',
    userApartment: 'B-205'
  }
];

const sampleBookings: Booking[] = [
  {
    id: 'book-001',
    amenityId: 'amen-gf-04',
    amenityName: 'Social Hall',
    userId: '2',
    userName: 'Michael Chen',
    userApartment: 'A-101',
    date: '2025-01-25',
    startTime: '18:00',
    endTime: '22:00',
    status: 'confirmed',
    specialRequests: 'Need extra chairs for 50 guests',
    totalAmount: 400,
    paymentStatus: 'paid',
    attendees: 50,
    equipment: ['Stage', 'Sound System', 'Tables', 'Chairs']
  },
  {
    id: 'book-002',
    amenityId: 'amen-gf-03',
    amenityName: 'Fitness Gym',
    userId: '2',
    userName: 'Michael Chen',
    userApartment: 'A-101',
    date: '2025-01-22',
    startTime: '06:00',
    endTime: '07:30',
    status: 'confirmed',
    totalAmount: 0,
    paymentStatus: 'paid',
    attendees: 1
  },
  {
    id: 'book-003',
    amenityId: 'amen-gf-08',
    amenityName: 'Swimming Pool',
    userId: '2',
    userName: 'Michael Chen',
    userApartment: 'A-101',
    date: '2025-01-23',
    startTime: '16:00',
    endTime: '17:00',
    status: 'confirmed',
    totalAmount: 20,
    paymentStatus: 'paid',
    attendees: 2,
    specialRequests: 'Family swimming session'
  },
  {
    id: 'book-004',
    amenityId: 'amen-rt-c-03',
    amenityName: 'Badminton Court',
    userId: '1',
    userName: 'Sarah Johnson',
    userApartment: 'B-205',
    date: '2025-01-21',
    startTime: '17:00',
    endTime: '18:00',
    status: 'completed',
    totalAmount: 30,
    paymentStatus: 'paid',
    attendees: 4
  },
  {
    id: 'book-005',
    amenityId: 'amen-rt-o-04',
    amenityName: 'BBQ & Grilling Area',
    userId: '2',
    userName: 'Michael Chen',
    userApartment: 'A-101',
    date: '2025-01-28',
    startTime: '19:00',
    endTime: '22:00',
    status: 'pending',
    specialRequests: 'Weekend BBQ party with friends',
    totalAmount: 120,
    paymentStatus: 'pending',
    attendees: 8,
    equipment: ['BBQ Grills', 'Tables', 'Chairs']
  },
  {
    id: 'book-006',
    amenityId: 'amen-rt-c-04',
    amenityName: 'Open Air Cinema',
    userId: '1',
    userName: 'Sarah Johnson',
    userApartment: 'B-205',
    date: '2025-01-26',
    startTime: '20:00',
    endTime: '23:00',
    status: 'confirmed',
    specialRequests: 'Movie night - The Godfather',
    totalAmount: 150,
    paymentStatus: 'paid',
    attendees: 20,
    equipment: ['Large Screen', 'Projector', 'Sound System']
  },
  {
    id: 'book-007',
    amenityId: 'amen-gf-01',
    amenityName: 'Music Room',
    userId: '2',
    userName: 'Michael Chen',
    userApartment: 'A-101',
    date: '2025-01-24',
    startTime: '15:00',
    endTime: '17:00',
    status: 'confirmed',
    totalAmount: 0,
    paymentStatus: 'paid',
    attendees: 3,
    equipment: ['Piano', 'Guitar', 'Microphones']
  },
  {
    id: 'book-008',
    amenityId: 'amen-rt-o-05',
    amenityName: 'Meditation Garden',
    userId: '1',
    userName: 'Sarah Johnson',
    userApartment: 'B-205',
    date: '2025-01-22',
    startTime: '06:30',
    endTime: '07:30',
    status: 'completed',
    specialRequests: 'Morning yoga session',
    totalAmount: 0,
    paymentStatus: 'paid',
    attendees: 5,
    equipment: ['Meditation Mats']
  }
];

const sampleAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Pool Near Maximum Capacity',
    description: 'Swimming pool is at 85% capacity. Consider implementing time slots to manage crowding.',
    priority: 'medium',
    actionRequired: true,
    timestamp: '2025-01-20T15:30:00Z',
    category: 'amenity'
  },
  {
    id: '2',
    type: 'prediction',
    title: 'Peak Visitor Time Approaching',
    description: 'Based on historical data, expect 40% increase in visitors between 6-8 PM today.',
    priority: 'low',
    actionRequired: false,
    timestamp: '2025-01-20T16:00:00Z',
    category: 'visitor'
  },
  {
    id: '3',
    type: 'suggestion',
    title: 'Gym Equipment Maintenance Due',
    description: 'Treadmill #3 usage indicates maintenance required within next 7 days.',
    priority: 'high',
    actionRequired: true,
    timestamp: '2025-01-20T14:00:00Z',
    category: 'maintenance'
  }
];

const sampleStaffMembers: StaffMember[] = [
  {
    id: '1',
    name: 'David Rodriguez',
    role: 'security',
    phone: '+1234567892',
    email: 'security@vms.com',
    shift: 'morning',
    isOnDuty: true,
    lastCheckIn: '2025-01-20T06:00:00Z',
    assignedZones: ['main-gate', 'parking', 'ground-floor'],
    tasks: [
      {
        id: '1',
        title: 'Morning Patrol Round',
        description: 'Complete security patrol of all common areas',
        type: 'patrol',
        assignedTo: '1',
        status: 'completed',
        priority: 'high',
        dueDate: '2025-01-20T08:00:00Z',
        completedAt: '2025-01-20T07:45:00Z',
        location: 'All Zones',
        checkpoints: ['Main Gate', 'Parking', 'Gym', 'Pool', 'Rooftop']
      }
    ],
    performance: {
      rating: 4.8,
      completedTasks: 95,
      responseTime: 3.2
    }
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [visitors, setVisitors] = useState<Visitor[]>(sampleVisitors);
  const [amenities, setAmenities] = useState<Amenity[]>(sampleAmenities);
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [domesticStaff, setDomesticStaff] = useState<DomesticStaff[]>(sampleDomesticStaff);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>(sampleParkingSlots);
  const [complaints, setComplaints] = useState<Complaint[]>(sampleComplaints);
  const [notices, setNotices] = useState<Notice[]>(sampleNotices);
  const [payments, setPayments] = useState<Payment[]>(samplePayments);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>(sampleAIInsights);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(sampleStaffMembers);

  const analytics: Analytics = {
    visitorCount: {
      today: 28,
      week: 156,
      month: 642,
      year: 2847
    },
    amenityUsage: {
      'Fitness Gym': 92,
      'Swimming Pool': 85,
      'Cinema Hall': 67,
      'Library': 45,
      'Music Room': 38,
      'Social Hall': 25
    },
    peakHours: ['09:00', '18:00', '20:00'],
    securityAlerts: 5,
    parkingOccupancy: 78,
    maintenanceRequests: 12,
    paymentCollection: 94,
    staffAttendance: 96,
    emergencyResponseTime: 2.3,
    residentSatisfaction: 4.6,
    predictions: {
      nextPeakTime: '18:30',
      maintenanceDue: ['Gym Equipment', 'Pool Filter', 'Cinema Projector'],
      popularAmenities: ['Gym', 'Pool', 'Rooftop Garden']
    }
  };

  const addVisitor = (visitor: Omit<Visitor, 'id'>) => {
    const newVisitor: Visitor = {
      ...visitor,
      id: Date.now().toString(),
      qrCode: `QR${Date.now()}`
    };
    setVisitors(prev => [...prev, newVisitor]);
  };

  const updateVisitor = (id: string, updates: Partial<Visitor>) => {
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const addBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString()
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const triggerEmergency = (alert: Omit<EmergencyAlert, 'id'>) => {
    const newAlert: EmergencyAlert = {
      ...alert,
      id: Date.now().toString(),
      acknowledgedBy: []
    };
    setEmergencyAlerts(prev => [...prev, newAlert]);
  };

  const acknowledgeAlert = (alertId: string, userId: string) => {
    setEmergencyAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledgedBy: [...alert.acknowledgedBy, userId] }
        : alert
    ));
  };

  const addComplaint = (complaint: Omit<Complaint, 'id'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now().toString(),
      comments: []
    };
    setComplaints(prev => [...prev, newComplaint]);
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addNotice = (notice: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...notice,
      id: Date.now().toString(),
      readBy: []
    };
    setNotices(prev => [...prev, newNotice]);
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addDomesticStaff = (staff: Omit<DomesticStaff, 'id'>) => {
    const newStaff: DomesticStaff = {
      ...staff,
      id: Date.now().toString()
    };
    setDomesticStaff(prev => [...prev, newStaff]);
  };

  const updateParkingSlot = (id: string, updates: Partial<ParkingSlot>) => {
    setParkingSlots(prev => prev.map(slot => slot.id === id ? { ...slot, ...updates } : slot));
  };

  const updateAmenity = (id: string, updates: Partial<Amenity>) => {
    setAmenities(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAmenity = (id: string) => {
    setAmenities(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AppContext.Provider value={{
      visitors,
      amenities,
      bookings,
      emergencyAlerts,
      analytics,
      domesticStaff,
      parkingSlots,
      complaints,
      notices,
      payments,
      aiInsights,
      staffMembers,
      addVisitor,
      updateVisitor,
      addBooking,
      updateBooking,
      triggerEmergency,
      acknowledgeAlert,
      addComplaint,
      updateComplaint,
      addNotice,
      updatePayment,
      addDomesticStaff,
      updateParkingSlot,
      updateAmenity,
      deleteAmenity
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}