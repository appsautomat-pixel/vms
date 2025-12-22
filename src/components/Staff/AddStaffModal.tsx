import React, { useState } from 'react';
import { X, Save, Upload, User, Mail, Phone, MapPin, Calendar, Clock, Shield } from 'lucide-react';
import { StaffMember, DomesticStaff } from '../../types';

interface AddStaffModalProps {
  onClose: () => void;
  onSave: (staff: any) => void;
  staffType: 'facility' | 'domestic';
}

export default function AddStaffModal({ onClose, onSave, staffType }: AddStaffModalProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    phone: '',
    email: '',
    role: staffType === 'facility' ? 'security' : 'maid',
    shift: 'morning',
    type: 'maid',
    employerName: '',
    employerApartment: '',
    workingDays: [],
    workingHours: '09:00-17:00',
    assignedZones: [],
    backgroundVerified: false,
    isActive: true,
    biometricEnabled: false,
    nfcEnabled: false
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWorkingDaysToggle = (day: string) => {
    setFormData((prev: any) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d: string) => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleZoneToggle = (zone: string) => {
    setFormData((prev: any) => ({
      ...prev,
      assignedZones: prev.assignedZones.includes(zone)
        ? prev.assignedZones.filter((z: string) => z !== zone)
        : [...prev.assignedZones, zone]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newStaff = {
      ...formData,
      id: Date.now().toString(),
      photo: photoPreview || `https://ui-avatars.com/api/?name=${formData.name}&background=6366f1&color=fff`,
      lastAttendance: new Date().toISOString(),
      performance: {
        rating: 0,
        completedTasks: 0,
        responseTime: 0
      },
      tasks: []
    };

    onSave(newStaff);
    onClose();
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const zones = ['main-gate', 'parking', 'ground-floor', 'rooftop-closed', 'rooftop-open', 'basement'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add {staffType === 'facility' ? 'Facility Staff' : 'Domestic Staff'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details to register a new staff member
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Profile Photo</h3>
              <p className="text-sm text-gray-500">
                Upload a clear photo for identification purposes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-900 mb-2">
                <Shield className="h-4 w-4 inline mr-2" />
                {staffType === 'facility' ? 'Role' : 'Staff Type'}
              </label>
              <select
                id="role"
                value={staffType === 'facility' ? formData.role : formData.type}
                onChange={(e) => staffType === 'facility'
                  ? setFormData({ ...formData, role: e.target.value })
                  : setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {staffType === 'facility' ? (
                  <>
                    <option value="security">Security</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="facility-manager">Facility Manager</option>
                  </>
                ) : (
                  <>
                    <option value="maid">Maid</option>
                    <option value="driver">Driver</option>
                    <option value="gardener">Gardener</option>
                    <option value="cook">Cook</option>
                    <option value="security">Security</option>
                    <option value="maintenance">Maintenance</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {staffType === 'facility' && (
            <>
              <div>
                <label htmlFor="shift" className="block text-sm font-medium text-gray-900 mb-2">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Shift
                </label>
                <select
                  id="shift"
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="morning">Morning (6 AM - 2 PM)</option>
                  <option value="evening">Evening (2 PM - 10 PM)</option>
                  <option value="night">Night (10 PM - 6 AM)</option>
                  <option value="rotating">Rotating</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Assigned Zones
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {zones.map((zone) => (
                    <label
                      key={zone}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.assignedZones.includes(zone)}
                        onChange={() => handleZoneToggle(zone)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{zone.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {staffType === 'domestic' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="employerName" className="block text-sm font-medium text-gray-900 mb-2">
                    Employer Name
                  </label>
                  <input
                    type="text"
                    id="employerName"
                    value={formData.employerName}
                    onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="employerApartment" className="block text-sm font-medium text-gray-900 mb-2">
                    Employer Apartment
                  </label>
                  <input
                    type="text"
                    id="employerApartment"
                    value={formData.employerApartment}
                    onChange={(e) => setFormData({ ...formData, employerApartment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., A-101"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="workingHours" className="block text-sm font-medium text-gray-900 mb-2">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Working Hours
                </label>
                <input
                  type="text"
                  id="workingHours"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 09:00-17:00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Working Days
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weekDays.map((day) => (
                    <label
                      key={day}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.workingDays.includes(day)}
                        onChange={() => handleWorkingDaysToggle(day)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="space-y-3">
            <label className="flex items-center p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={formData.backgroundVerified}
                onChange={(e) => setFormData({ ...formData, backgroundVerified: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">Background Verification Complete</span>
            </label>

            <label className="flex items-center p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={formData.biometricEnabled}
                onChange={(e) => setFormData({ ...formData, biometricEnabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">Enable Biometric Access</span>
            </label>

            <label className="flex items-center p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={formData.nfcEnabled}
                onChange={(e) => setFormData({ ...formData, nfcEnabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">Enable NFC Card Access</span>
            </label>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Add Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
