export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'resident' | 'visitor' | 'admin' | 'security' | 'facility-manager';
  apartmentNo?: string;
  guardianId?: string;
  profileComplete: boolean;
  biometricEnabled?: boolean;
  nfcEnabled?: boolean;
  lastLogin?: string;
  avatar?: string;
}

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  email: string;
  idNumber: string;
  photo?: string;
  purpose: string;
  hostId: string;
  hostName: string;
  hostApartment: string;
  visitDate: string;
  visitTime: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'pending' | 'approved' | 'rejected' | 'checked-in' | 'checked-out' | 'expired';
  qrCode: string;
  isBlacklisted?: boolean;
  vehicleNumber?: string;
  accessZones?: string[];
  validUntil?: string;
  biometricData?: string;
  deliveryType?: 'personal' | 'food' | 'grocery' | 'courier' | 'service';
  vendorType?: 'amazon' | 'swiggy' | 'zomato' | 'flipkart' | 'other';
  assets?: string[];
}

export interface DomesticStaff {
  id: string;
  name: string;
  phone: string;
  type: 'maid' | 'driver' | 'gardener' | 'cook' | 'security' | 'maintenance';
  employerId: string;
  employerName: string;
  employerApartment: string;
  workingDays: string[];
  workingHours: string;
  isActive: boolean;
  lastAttendance?: string;
  photo?: string;
  idProof?: string;
  backgroundVerified: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  code: string;
  location: 'ground-floor' | 'rooftop-closed' | 'rooftop-open' | 'basement' | 'parking';
  type: 'reservation' | 'open-access' | 'monitoring' | 'payment-required';
  capacity?: number;
  currentOccupancy: number;
  isAvailable: boolean;
  requiresApproval?: boolean;
  requiresGuardian?: boolean;
  requiresPayment?: boolean;
  pricePerHour?: number;
  slots?: TimeSlot[];
  maintenanceStatus: 'operational' | 'maintenance' | 'out-of-order';
  lastCleaned?: string;
  nextMaintenance?: string;
  equipment?: string[];
  rules?: string[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedBy?: string;
  date: string;
  price?: number;
  status: 'available' | 'booked' | 'maintenance' | 'blocked';
}

export interface Booking {
  id: string;
  amenityId: string;
  amenityName: string;
  userId: string;
  userName: string;
  userApartment: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  specialRequests?: string;
  totalAmount?: number;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  attendees?: number;
  equipment?: string[];
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  type: 'visitor' | 'resident' | 'ev-charging' | 'disabled';
  isOccupied: boolean;
  occupiedBy?: string;
  vehicleNumber?: string;
  timeIn?: string;
  timeOut?: string;
  floor: string;
  zone: string;
  isEVCharging?: boolean;
  chargingStatus?: 'available' | 'charging' | 'completed';
}

export interface EmergencyAlert {
  id: string;
  type: 'evacuation' | 'fire' | 'medical' | 'security' | 'panic' | 'maintenance';
  message: string;
  timestamp: string;
  isActive: boolean;
  acknowledgedBy: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  reportedBy: string;
  responseTeam?: string[];
  resolvedAt?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'maintenance' | 'security' | 'noise' | 'cleanliness' | 'amenity' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  reportedBy: string;
  reporterApartment: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  photos?: string[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  type: 'update' | 'resolution' | 'escalation';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'event' | 'maintenance' | 'emergency' | 'poll';
  priority: 'low' | 'medium' | 'high';
  publishedBy: string;
  publishedAt: string;
  expiresAt?: string;
  targetAudience: 'all' | 'residents' | 'staff' | 'security';
  attachments?: string[];
  isActive: boolean;
  readBy?: string[];
}

export interface Payment {
  id: string;
  type: 'maintenance' | 'amenity' | 'parking' | 'fine' | 'utility';
  amount: number;
  description: string;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: 'upi' | 'card' | 'cash' | 'bank-transfer';
  transactionId?: string;
  userId: string;
  userApartment: string;
}

export interface Analytics {
  visitorCount: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  amenityUsage: {
    [key: string]: number;
  };
  peakHours: string[];
  securityAlerts: number;
  parkingOccupancy: number;
  maintenanceRequests: number;
  paymentCollection: number;
  staffAttendance: number;
  emergencyResponseTime: number;
  residentSatisfaction: number;
  predictions: {
    nextPeakTime: string;
    maintenanceDue: string[];
    popularAmenities: string[];
  };
}

export interface AIInsight {
  id: string;
  type: 'suggestion' | 'alert' | 'prediction' | 'optimization';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionRequired: boolean;
  timestamp: string;
  category: 'security' | 'maintenance' | 'amenity' | 'parking' | 'visitor';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'security' | 'maintenance' | 'cleaning' | 'facility-manager';
  phone: string;
  email: string;
  shift: 'morning' | 'evening' | 'night' | 'rotating';
  isOnDuty: boolean;
  lastCheckIn?: string;
  assignedZones: string[];
  tasks: Task[];
  performance: {
    rating: number;
    completedTasks: number;
    responseTime: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'patrol' | 'maintenance' | 'cleaning' | 'inspection';
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completedAt?: string;
  location: string;
  checkpoints?: string[];
}