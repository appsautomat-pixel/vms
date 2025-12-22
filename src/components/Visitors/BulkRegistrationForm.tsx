import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Upload, Download, FileText, Users, Check, X, CircleAlert as AlertCircle, Send } from 'lucide-react';

interface BulkRegistrationFormProps {
  onClose: () => void;
  onSuccess: (count: number) => void;
}

export default function BulkRegistrationForm({ onClose, onSuccess }: BulkRegistrationFormProps) {
  const { user } = useAuth();
  const { addVisitor } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const sampleData = [
    ['Name', 'Phone', 'Email', 'ID Number', 'Purpose', 'Visit Date', 'Visit Time', 'Vehicle Number'],
    ['John Doe', '+1234567890', 'john@email.com', 'DL123456', 'Social Visit', '2025-01-25', '14:00', 'MH01AB1234'],
    ['Jane Smith', '+1234567891', 'jane@email.com', 'ID789012', 'Business Meeting', '2025-01-25', '15:30', ''],
    ['Mike Johnson', '+1234567892', 'mike@email.com', 'PP345678', 'Maintenance Service', '2025-01-26', '10:00', 'MH02CD5678']
  ];

  const downloadSampleCSV = () => {
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visitor_bulk_registration_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      validateFile(uploadedFile);
    }
  };

  const validateFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const requiredHeaders = ['Name', 'Phone', 'Email', 'ID Number', 'Purpose', 'Visit Date', 'Visit Time'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        alert(`Missing required columns: ${missingHeaders.join(', ')}`);
        setFile(null);
        setIsProcessing(false);
        return;
      }

      const results = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const visitor: any = {};
        
        headers.forEach((header, index) => {
          visitor[header.toLowerCase().replace(' ', '')] = values[index] || '';
        });

        // Validation
        const errors = [];
        if (!visitor.name) errors.push('Name is required');
        if (!visitor.phone) errors.push('Phone is required');
        if (!visitor.email) errors.push('Email is required');
        if (!visitor.idnumber) errors.push('ID Number is required');
        if (!visitor.purpose) errors.push('Purpose is required');
        if (!visitor.visitdate) errors.push('Visit Date is required');
        if (!visitor.visittime) errors.push('Visit Time is required');

        results.push({
          row: i + 1,
          data: visitor,
          errors,
          isValid: errors.length === 0
        });
      }

      setValidationResults(results);
      setShowPreview(true);
    } catch (error) {
      alert('Error reading file. Please ensure it\'s a valid CSV file.');
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkSubmit = async () => {
    setIsProcessing(true);
    
    try {
      const validVisitors = validationResults.filter(result => result.isValid);
      
      for (const result of validVisitors) {
        const visitorData = {
          name: result.data.name,
          phone: result.data.phone,
          email: result.data.email,
          idNumber: result.data.idnumber,
          purpose: result.data.purpose,
          visitDate: result.data.visitdate,
          visitTime: result.data.visittime,
          vehicleNumber: result.data.vehiclenumber || '',
          hostId: user?.id || '',
          hostName: user?.name || '',
          hostApartment: user?.apartmentNo || '',
          status: 'pending' as const,
          qrCode: `QR${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };

        addVisitor(visitorData);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      onSuccess(validVisitors.length);
      onClose();
    } catch (error) {
      alert('Error processing bulk registration. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Bulk Visitor Registration
              </h2>
              <p className="text-purple-100 text-sm">Upload CSV file to register multiple visitors</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {!showPreview ? (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-900">Instructions</h4>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Download the sample CSV template below</li>
                      <li>• Fill in visitor details following the format</li>
                      <li>• Required fields: Name, Phone, Email, ID Number, Purpose, Visit Date, Visit Time</li>
                      <li>• Optional fields: Vehicle Number</li>
                      <li>• Date format: YYYY-MM-DD, Time format: HH:MM</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Download Template */}
              <div className="text-center">
                <button
                  onClick={downloadSampleCSV}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </button>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <span className="mt-2 block text-lg font-medium text-gray-900">
                      Upload CSV File
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      Select your completed CSV file
                    </span>
                  </label>
                  <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                {file && (
                  <p className="text-sm text-green-600 mt-2">✓ File selected: {file.name}</p>
                )}
              </div>

              {isProcessing && (
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Processing file...
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Validation Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">
                    {validationResults.filter(r => r.isValid).length}
                  </div>
                  <div className="text-sm text-green-700">Valid Records</div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <X className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-900">
                    {validationResults.filter(r => !r.isValid).length}
                  </div>
                  <div className="text-sm text-red-700">Invalid Records</div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">
                    {validationResults.length}
                  </div>
                  <div className="text-sm text-blue-700">Total Records</div>
                </div>
              </div>

              {/* Preview Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Preview & Validation Results</h4>
                </div>
                <div className="overflow-x-auto max-h-64">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Row</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Visit Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Errors</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {validationResults.map((result, index) => (
                        <tr key={index} className={result.isValid ? 'bg-green-50' : 'bg-red-50'}>
                          <td className="px-4 py-2 text-sm text-gray-900">{result.row}</td>
                          <td className="px-4 py-2">
                            {result.isValid ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{result.data.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{result.data.phone}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{result.data.email}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{result.data.visitdate}</td>
                          <td className="px-4 py-2 text-sm text-red-600">
                            {result.errors.length > 0 && (
                              <div className="flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                <span className="text-xs">{result.errors.join(', ')}</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={() => {
                if (showPreview) {
                  setShowPreview(false);
                  setFile(null);
                  setValidationResults([]);
                } else {
                  onClose();
                }
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showPreview ? 'Back' : 'Cancel'}
            </button>
            
            {showPreview && (
              <button
                onClick={handleBulkSubmit}
                disabled={isProcessing || validationResults.filter(r => r.isValid).length === 0}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Register {validationResults.filter(r => r.isValid).length} Visitors
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}