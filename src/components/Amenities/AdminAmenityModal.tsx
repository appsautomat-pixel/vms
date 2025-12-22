import React, { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { Amenity } from '../../types';

interface AdminAmenityModalProps {
  amenity: Amenity;
  onClose: () => void;
  onUpdate: (amenity: Amenity) => void;
  onDelete?: (amenityId: string) => void;
}

export default function AdminAmenityModal({ amenity, onClose, onUpdate, onDelete }: AdminAmenityModalProps) {
  const [formData, setFormData] = useState<Amenity>(amenity);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(amenity.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Amenity</h2>
            <p className="text-sm text-gray-500 mt-1">{amenity.code}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Amenity Name
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
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <input
                type="text"
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="ground-floor">Ground Floor</option>
                <option value="rooftop-closed">Rooftop (Closed)</option>
                <option value="rooftop-open">Rooftop (Open)</option>
                <option value="basement">Basement</option>
                <option value="parking">Parking</option>
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="reservation">Reservation</option>
                <option value="open-access">Open Access</option>
                <option value="monitoring">Monitoring</option>
                <option value="payment-required">Payment Required</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                min="0"
                value={formData.capacity || 0}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="currentOccupancy" className="block text-sm font-medium text-gray-700 mb-2">
                Current Occupancy
              </label>
              <input
                type="number"
                id="currentOccupancy"
                min="0"
                value={formData.currentOccupancy}
                onChange={(e) => setFormData({ ...formData, currentOccupancy: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="maintenanceStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Status
              </label>
              <select
                id="maintenanceStatus"
                value={formData.maintenanceStatus}
                onChange={(e) => setFormData({ ...formData, maintenanceStatus: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="operational">Operational</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="out-of-order">Out of Order</option>
              </select>
            </div>

            <div>
              <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-2">
                Price per Hour (₹)
              </label>
              <input
                type="number"
                id="pricePerHour"
                min="0"
                step="0.01"
                value={formData.pricePerHour || 0}
                onChange={(e) => setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Available for booking</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.requiresApproval || false}
                onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Requires admin approval</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.requiresGuardian || false}
                onChange={(e) => setFormData({ ...formData, requiresGuardian: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Requires guardian supervision</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.requiresPayment || false}
                onChange={(e) => setFormData({ ...formData, requiresPayment: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Requires payment</span>
            </label>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            {onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Amenity?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete {amenity.name}? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
