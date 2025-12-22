import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { User, Phone, Mail, Calendar, Clock, FileText, Upload, Car, Shield, Users, X, Check, Camera, QrCode, Send } from 'lucide-react';

interface PreRegistrationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function PreRegistrationForm({ onClose, onSuccess }: PreRegistrationFormProps) {
  const { user } = useAuth();
  const { addVisitor } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    idNumber: '',
    purpose: '',
    visitDate: '',
    visitTime: '',
    vehicleNumber: '',
    deliveryType: '',
    vendorType: '',
    assets: [] as string[],
    accessZones: [] as string[],
    photo: null as File | null,
    idProof: null as File | null,
    specialRequests: '',
    emergencyContact: '',
    relationship: '',
    expectedDuration: '2'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Information', icon: User },
    { id: 2, title: 'Visit Details', icon: Calendar },
    { id: 3, title: 'Documents & Photos', icon: Upload },
    { id: 4, title: 'Additional Information', icon: FileText }
  ];

  const purposeOptions = [
    'Social Visit',
    'Business Meeting',
    'Maintenance Service',
    'Food Delivery',
    'Grocery Delivery',
    'Courier Delivery',
    'Medical Visit',
    'Family Visit',
    'Official Work',
    'Other'
  ];

  const deliveryTypes = [
    { value: 'personal', label: 'Personal Visit' },
    { value: 'food', label: 'Food Delivery' },
    { value: 'grocery', label: 'Grocery Delivery' },
    { value: 'courier', label: 'Courier/Package' },
    { value: 'service', label: 'Service Provider' }
  ];

  const vendorTypes = [
    { value: 'amazon', label: 'Amazon' },
    { value: 'flipkart', label: 'Flipkart' },
    { value: 'swiggy', label: 'Swiggy' },
    { value: 'zomato', label: 'Zomato' },
    { value: 'bigbasket', label: 'BigBasket' },
    { value: 'grofers', label: 'Blinkit/Grofers' },
    { value: 'other', label: 'Other' }
  ];

  const accessZoneOptions = [
    { value: 'ground-floor', label: 'Ground Floor Amenities' },
    { value: 'rooftop-open', label: 'Rooftop Open Areas' },
    { value: 'rooftop-closed', label: 'Rooftop Closed Areas' },
    { value: 'parking', label: 'Parking Area' },
    { value: 'basement', label: 'Basement' }
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
        break;
      case 2:
        if (!formData.purpose) newErrors.purpose = 'Purpose of visit is required';
        if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
        if (!formData.visitTime) newErrors.visitTime = 'Visit time is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const visitorData = {
        ...formData,
        hostId: user?.id || '',
        hostName: user?.name || '',
        hostApartment: user?.apartmentNo || '',
        status: 'pending' as const,
        qrCode: `QR${Date.now()}`,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        biometricData: formData.photo ? 'captured' : undefined
      };

      addVisitor(visitorData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 inline mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter visitor's full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="h-4 w-4 inline mr-1" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+1234567890"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 inline mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="visitor@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Shield className="h-4 w-4 inline mr-1" />
            ID Number *
          </label>
          <input
            type="text"
            value={formData.idNumber}
            onChange={(e) => handleInputChange('idNumber', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.idNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Driver's License / Passport / Aadhar"
          />
          {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="h-4 w-4 inline mr-1" />
            Emergency Contact
          </label>
          <input
            type="tel"
            value={formData.emergencyContact}
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            placeholder="Emergency contact number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="h-4 w-4 inline mr-1" />
            Relationship to Host
          </label>
          <select
            value={formData.relationship}
            onChange={(e) => handleInputChange('relationship', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          >
            <option value="">Select relationship</option>
            <option value="family">Family Member</option>
            <option value="friend">Friend</option>
            <option value="colleague">Colleague</option>
            <option value="business">Business Associate</option>
            <option value="service">Service Provider</option>
            <option value="delivery">Delivery Person</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4 inline mr-1" />
            Purpose of Visit *
          </label>
          <select
            value={formData.purpose}
            onChange={(e) => handleInputChange('purpose', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.purpose ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select purpose</option>
            {purposeOptions.map(purpose => (
              <option key={purpose} value={purpose}>{purpose}</option>
            ))}
          </select>
          {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Visit Date *
          </label>
          <input
            type="date"
            value={formData.visitDate}
            onChange={(e) => handleInputChange('visitDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.visitDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.visitDate && <p className="text-red-500 text-sm mt-1">{errors.visitDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Visit Time *
          </label>
          <input
            type="time"
            value={formData.visitTime}
            onChange={(e) => handleInputChange('visitTime', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.visitTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.visitTime && <p className="text-red-500 text-sm mt-1">{errors.visitTime}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Expected Duration (hours)
          </label>
          <select
            value={formData.expectedDuration}
            onChange={(e) => handleInputChange('expectedDuration', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          >
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="4">4 hours</option>
            <option value="8">8 hours</option>
            <option value="24">Full day</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Car className="h-4 w-4 inline mr-1" />
            Vehicle Number (if applicable)
          </label>
          <input
            type="text"
            value={formData.vehicleNumber}
            onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            placeholder="MH01AB1234"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Type
          </label>
          <select
            value={formData.deliveryType}
            onChange={(e) => handleInputChange('deliveryType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          >
            <option value="">Select delivery type</option>
            {deliveryTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {formData.deliveryType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor/Service Provider
          </label>
          <select
            value={formData.vendorType}
            onChange={(e) => handleInputChange('vendorType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          >
            <option value="">Select vendor</option>
            {vendorTypes.map(vendor => (
              <option key={vendor.value} value={vendor.value}>{vendor.label}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Access Zones Required
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {accessZoneOptions.map(zone => (
            <label key={zone.value} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={formData.accessZones.includes(zone.value)}
                onChange={() => handleArrayToggle('accessZones', zone.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">{zone.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Camera className="h-4 w-4 inline mr-1" />
            Visitor Photo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
            <Camera className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="photo-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload visitor photo
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  PNG, JPG up to 5MB
                </span>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('photo', e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
          </div>
          {formData.photo && (
            <p className="text-sm text-green-600 mt-2">✓ Photo uploaded: {formData.photo.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Shield className="h-4 w-4 inline mr-1" />
            ID Proof Document
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="id-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload ID proof
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  PDF, PNG, JPG up to 5MB
                </span>
              </label>
              <input
                id="id-upload"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('idProof', e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
          </div>
          {formData.idProof && (
            <p className="text-sm text-green-600 mt-2">✓ ID proof uploaded: {formData.idProof.name}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <QrCode className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">QR Code Generation</h4>
            <p className="text-sm text-blue-700 mt-1">
              A unique QR code will be automatically generated for this visitor after registration. 
              The visitor will receive this via SMS/Email for contactless entry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assets/Items Being Brought
        </label>
        <div className="space-y-2">
          {formData.assets.map((asset, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={asset}
                onChange={(e) => {
                  const newAssets = [...formData.assets];
                  newAssets[index] = e.target.value;
                  handleInputChange('assets', newAssets);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Laptop, Tools, Food package"
              />
              <button
                type="button"
                onClick={() => {
                  const newAssets = formData.assets.filter((_, i) => i !== index);
                  handleInputChange('assets', newAssets);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleInputChange('assets', [...formData.assets, ''])}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            + Add Asset
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests/Notes
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => handleInputChange('specialRequests', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          placeholder="Any special requirements, accessibility needs, or additional information..."
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <Check className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-green-900">Registration Summary</h4>
            <div className="text-sm text-green-700 mt-2 space-y-1">
              <p><strong>Visitor:</strong> {formData.name}</p>
              <p><strong>Visit Date:</strong> {formData.visitDate} at {formData.visitTime}</p>
              <p><strong>Purpose:</strong> {formData.purpose}</p>
              <p><strong>Host:</strong> {user?.name} ({user?.apartmentNo})</p>
              {formData.vehicleNumber && <p><strong>Vehicle:</strong> {formData.vehicleNumber}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Visitor Pre-Registration</h2>
              <p className="text-indigo-100 text-sm">Step {currentStep} of 4</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-96">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-3">
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  Next
                  <Send className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Registration
                      <Check className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}