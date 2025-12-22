import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Upload, Download, Users, Building, Car, CreditCard, FileText, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Loader as Loader2, Trash2, FileSpreadsheet, Database } from 'lucide-react';

export default function BulkOperations() {
  const { user } = useAuth();
  const { visitors, amenities, parkingSlots, payments } = useApp();
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [operationResult, setOperationResult] = useState<any>(null);

  const operations = [
    {
      id: 'import-visitors',
      title: 'Import Visitors',
      description: 'Upload CSV file to bulk register visitors',
      icon: Users,
      color: 'blue',
      type: 'import',
      sampleData: 'name,phone,email,idNumber,purpose,hostName,hostApartment,visitDate,visitTime\nJohn Doe,+1234567890,john@email.com,ID123456,Social Visit,Michael Chen,A-101,2025-01-25,14:00'
    },
    {
      id: 'export-visitors',
      title: 'Export Visitors',
      description: 'Download all visitor records as CSV',
      icon: Users,
      color: 'green',
      type: 'export',
      count: visitors.length
    },
    {
      id: 'import-amenities',
      title: 'Import Amenities',
      description: 'Bulk upload amenity data',
      icon: Building,
      color: 'purple',
      type: 'import',
      sampleData: 'name,code,location,type,capacity,pricePerHour\nGym,GYM-001,ground-floor,open-access,30,0'
    },
    {
      id: 'export-amenities',
      title: 'Export Amenities',
      description: 'Download amenity catalog as CSV',
      icon: Building,
      color: 'indigo',
      type: 'export',
      count: amenities.length
    },
    {
      id: 'import-parking',
      title: 'Import Parking Data',
      description: 'Bulk register parking slots',
      icon: Car,
      color: 'yellow',
      type: 'import',
      sampleData: 'slotNumber,type,floor,zone,vehicleNumber,occupiedBy\nA-01,resident,Ground,A,MH01AB1234,Michael Chen'
    },
    {
      id: 'export-parking',
      title: 'Export Parking Data',
      description: 'Download parking records',
      icon: Car,
      color: 'orange',
      type: 'export',
      count: parkingSlots.length
    },
    {
      id: 'import-payments',
      title: 'Import Payment Data',
      description: 'Bulk upload payment records',
      icon: CreditCard,
      color: 'teal',
      type: 'import',
      sampleData: 'userApartment,type,amount,description,dueDate,status\nA-101,maintenance,5000,Monthly maintenance fee,2025-01-31,pending'
    },
    {
      id: 'export-payments',
      title: 'Export Payments',
      description: 'Download payment records',
      icon: CreditCard,
      color: 'pink',
      type: 'export',
      count: payments.length
    },
    {
      id: 'bulk-delete',
      title: 'Bulk Delete Records',
      description: 'Remove multiple records at once',
      icon: Trash2,
      color: 'red',
      type: 'delete'
    },
    {
      id: 'data-sync',
      title: 'Data Synchronization',
      description: 'Sync data across all modules',
      icon: Database,
      color: 'gray',
      type: 'sync'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setOperationResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      setIsProcessing(false);
      setOperationResult({
        success: true,
        message: 'Import completed successfully',
        imported: 45,
        updated: 12,
        failed: 3,
        details: [
          'Successfully imported 45 new records',
          'Updated 12 existing records',
          '3 records failed validation'
        ]
      });
    }, 2500);
  };

  const handleExport = (operationId: string) => {
    setIsProcessing(true);

    setTimeout(() => {
      let csvContent = '';
      let filename = '';

      switch (operationId) {
        case 'export-visitors':
          csvContent = 'Name,Phone,Email,ID Number,Purpose,Host,Apartment,Visit Date,Status\n';
          visitors.forEach(v => {
            csvContent += `${v.name},${v.phone},${v.email},${v.idNumber},${v.purpose},${v.hostName},${v.hostApartment},${v.visitDate},${v.status}\n`;
          });
          filename = 'visitors_export.csv';
          break;
        case 'export-amenities':
          csvContent = 'Name,Code,Location,Type,Capacity,Occupancy,Status\n';
          amenities.forEach(a => {
            csvContent += `${a.name},${a.code},${a.location},${a.type},${a.capacity},${a.currentOccupancy},${a.isAvailable ? 'Available' : 'Closed'}\n`;
          });
          filename = 'amenities_export.csv';
          break;
        case 'export-parking':
          csvContent = 'Slot Number,Type,Floor,Zone,Occupied,Vehicle Number\n';
          parkingSlots.forEach(p => {
            csvContent += `${p.slotNumber},${p.type},${p.floor},${p.zone},${p.isOccupied ? 'Yes' : 'No'},${p.vehicleNumber || ''}\n`;
          });
          filename = 'parking_export.csv';
          break;
        case 'export-payments':
          csvContent = 'Apartment,Type,Amount,Description,Due Date,Status\n';
          payments.forEach(p => {
            csvContent += `${p.userApartment},${p.type},${p.amount},${p.description},${p.dueDate},${p.status}\n`;
          });
          filename = 'payments_export.csv';
          break;
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      setIsProcessing(false);
      setOperationResult({
        success: true,
        message: 'Export completed successfully',
        exported: csvContent.split('\n').length - 1,
        details: [`Downloaded ${filename} with ${csvContent.split('\n').length - 1} records`]
      });
    }, 1000);
  };

  const handleDelete = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOperationResult({
        success: true,
        message: 'Bulk delete completed',
        deleted: 24,
        details: ['Deleted 24 expired visitor records']
      });
    }, 1500);
  };

  const handleSync = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOperationResult({
        success: true,
        message: 'Data synchronization completed',
        synced: 156,
        details: [
          'Synced 45 visitor records',
          'Synced 20 amenity bookings',
          'Synced 35 parking entries',
          'Synced 56 payment records'
        ]
      });
    }, 2000);
  };

  const handleOperationAction = (operation: any) => {
    setActiveOperation(operation.id);
    setOperationResult(null);
    setSelectedFile(null);
    setUploadProgress(0);

    if (operation.type === 'export') {
      handleExport(operation.id);
    } else if (operation.type === 'delete') {
      handleDelete();
    } else if (operation.type === 'sync') {
      handleSync();
    }
  };

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-50 text-blue-600 border-blue-100',
      green: 'bg-green-50 text-green-600 border-green-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-100',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
      orange: 'bg-orange-50 text-orange-600 border-orange-100',
      teal: 'bg-teal-50 text-teal-600 border-teal-100',
      pink: 'bg-pink-50 text-pink-600 border-pink-100',
      red: 'bg-red-50 text-red-600 border-red-100',
      gray: 'bg-gray-50 text-gray-600 border-gray-100'
    };
    return colors[color] || colors.blue;
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">
          Only administrators can access bulk operations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Bulk Operations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Import, export, and manage data in bulk across all modules.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> Always backup your data before performing bulk operations.
              Ensure your CSV files match the expected format to avoid import errors.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {operations.map((operation) => {
          const Icon = operation.icon;
          const isActive = activeOperation === operation.id;

          return (
            <div
              key={operation.id}
              className={`bg-white shadow-sm rounded-xl border ${
                isActive ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'
              } overflow-hidden hover:shadow-md transition-all cursor-pointer`}
              onClick={() => !isProcessing && handleOperationAction(operation)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(operation.color)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {operation.count !== undefined && (
                    <span className="text-sm font-medium text-gray-600">
                      {operation.count} records
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {operation.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {operation.description}
                </p>

                {operation.type === 'import' && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>Sample format:</strong>
                    <pre className="mt-1 overflow-x-auto">{operation.sampleData.split(',').slice(0, 3).join(',')}</pre>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOperationAction(operation);
                  }}
                  disabled={isProcessing}
                  className={`mt-4 w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    operation.type === 'delete'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : operation.type === 'export'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {operation.type === 'import' && <Upload className="h-4 w-4 inline mr-2" />}
                  {operation.type === 'export' && <Download className="h-4 w-4 inline mr-2" />}
                  {operation.type === 'delete' && <Trash2 className="h-4 w-4 inline mr-2" />}
                  {operation.type === 'sync' && <Database className="h-4 w-4 inline mr-2" />}
                  {operation.type === 'import' ? 'Import' : operation.type === 'export' ? 'Export' : operation.type === 'delete' ? 'Delete' : 'Sync'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {activeOperation && operations.find(o => o.id === activeOperation)?.type === 'import' && (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload File</h3>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Choose a CSV file
                </span>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={isProcessing}
                />
              </label>
              <p className="text-sm text-gray-500">or drag and drop</p>
            </div>
            {selectedFile && (
              <div className="mt-4 text-sm text-gray-900">
                Selected: <strong>{selectedFile.name}</strong>
              </div>
            )}
          </div>

          {selectedFile && !isProcessing && (
            <button
              onClick={handleImport}
              className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Import
            </button>
          )}

          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Processing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {isProcessing && activeOperation && operations.find(o => o.id === activeOperation)?.type !== 'import' && (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mr-3" />
            <span className="text-gray-900">Processing operation...</span>
          </div>
        </div>
      )}

      {operationResult && (
        <div className={`shadow-sm rounded-xl border p-6 ${
          operationResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {operationResult.success ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-lg font-medium ${
                operationResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {operationResult.message}
              </h3>

              {(operationResult.imported || operationResult.exported || operationResult.deleted || operationResult.synced) && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {operationResult.imported && (
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-2xl font-bold text-green-600">{operationResult.imported}</div>
                      <div className="text-xs text-gray-600">Imported</div>
                    </div>
                  )}
                  {operationResult.updated && (
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-2xl font-bold text-blue-600">{operationResult.updated}</div>
                      <div className="text-xs text-gray-600">Updated</div>
                    </div>
                  )}
                  {operationResult.failed && (
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-2xl font-bold text-red-600">{operationResult.failed}</div>
                      <div className="text-xs text-gray-600">Failed</div>
                    </div>
                  )}
                  {operationResult.exported && (
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-2xl font-bold text-green-600">{operationResult.exported}</div>
                      <div className="text-xs text-gray-600">Exported</div>
                    </div>
                  )}
                  {operationResult.deleted && (
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-2xl font-bold text-red-600">{operationResult.deleted}</div>
                      <div className="text-xs text-gray-600">Deleted</div>
                    </div>
                  )}
                  {operationResult.synced && (
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-2xl font-bold text-blue-600">{operationResult.synced}</div>
                      <div className="text-xs text-gray-600">Synced</div>
                    </div>
                  )}
                </div>
              )}

              {operationResult.details && operationResult.details.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {operationResult.details.map((detail: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
