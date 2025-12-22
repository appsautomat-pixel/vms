import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import { Building, Mountain, Users, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Calendar, Settings, Plus, X } from 'lucide-react';
import BookingModal from '../components/Amenities/BookingModal';
import AdminAmenityModal from '../components/Amenities/AdminAmenityModal';
import { Amenity } from '../types';

export default function Amenities() {
  const { user } = useAuth();
  const { amenities, bookings, addBooking, updateAmenity, deleteAmenity } = useApp();
  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedAmenityForBooking, setSelectedAmenityForBooking] = useState<Amenity | null>(null);
  const [selectedAmenityForAdmin, setSelectedAmenityForAdmin] = useState<Amenity | null>(null);
  const [showMyBookings, setShowMyBookings] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('my-bookings')) {
      setShowMyBookings(true);
    } else {
      setShowMyBookings(false);
    }
  }, [location]);

  const locations = [
    { value: 'all', label: 'All Locations', icon: Building },
    { value: 'ground-floor', label: 'Ground Floor', icon: Building },
    { value: 'rooftop-closed', label: 'Rooftop (Closed)', icon: Mountain },
    { value: 'rooftop-open', label: 'Rooftop (Open)', icon: Mountain }
  ];

  const filteredAmenities = selectedLocation === 'all'
    ? amenities
    : amenities.filter(a => a.location === selectedLocation);

  const myBookings = bookings.filter(b => b.userId === user?.id);

  const getStatusColor = (amenity: Amenity) => {
    if (!amenity.isAvailable || amenity.maintenanceStatus !== 'operational') return 'red';
    const occupancyRate = (amenity.currentOccupancy / (amenity.capacity || 1)) * 100;
    if (occupancyRate >= 90) return 'red';
    if (occupancyRate >= 70) return 'yellow';
    return 'green';
  };

  const getStatusText = (amenity: Amenity) => {
    if (amenity.maintenanceStatus === 'maintenance') return 'Under Maintenance';
    if (amenity.maintenanceStatus === 'out-of-order') return 'Out of Order';
    if (!amenity.isAvailable) return 'Closed';
    const occupancyRate = (amenity.currentOccupancy / (amenity.capacity || 1)) * 100;
    if (occupancyRate >= 90) return 'Full';
    if (occupancyRate >= 70) return 'Busy';
    return 'Available';
  };

  const handleBooking = (booking: any) => {
    addBooking({
      ...booking,
      userId: user!.id,
      userName: user!.name,
      id: Date.now().toString()
    });

    const amenity = amenities.find(a => a.id === booking.amenityId);
    const message = amenity?.requiresApproval
      ? `Booking request submitted for ${booking.amenityName}. Awaiting admin approval.`
      : `Successfully booked ${booking.amenityName} for ${booking.date} from ${booking.startTime} to ${booking.endTime}`;

    alert(message);
  };

  const handleCheckIn = (amenityId: string) => {
    const amenity = amenities.find(a => a.id === amenityId);
    if (amenity) {
      updateAmenity(amenityId, {
        currentOccupancy: amenity.currentOccupancy + 1
      });
      alert(`Checked in to ${amenity.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Amenities</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and book available amenities in the residential complex.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowMyBookings(!showMyBookings)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showMyBookings
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            My Bookings ({myBookings.length})
          </button>
        </div>
      </div>

      {showMyBookings && (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">My Bookings</h3>
              <p className="text-sm text-gray-500 mt-1">
                {myBookings.length} {myBookings.length === 1 ? 'booking' : 'bookings'} found
              </p>
            </div>
            <button
              onClick={() => setShowMyBookings(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {myBookings.length > 0 ? (
            <div className="space-y-4">
              {myBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{booking.amenityName}</h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {booking.startTime} - {booking.endTime}
                        </span>
                        {booking.attendees && (
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {booking.attendees} {booking.attendees === 1 ? 'person' : 'people'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      {booking.totalAmount && booking.totalAmount > 0 && (
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ₹{booking.totalAmount.toFixed(2)}
                          </div>
                          <div className={`text-xs font-medium ${
                            booking.paymentStatus === 'paid' ? 'text-green-600' :
                            booking.paymentStatus === 'pending' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {booking.paymentStatus === 'paid' ? 'Paid' :
                             booking.paymentStatus === 'pending' ? 'Payment Pending' :
                             'Refunded'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-700 mb-1">Special Requests:</p>
                      <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                    </div>
                  )}

                  {booking.equipment && booking.equipment.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Equipment:</p>
                      <div className="flex flex-wrap gap-2">
                        {booking.equipment.map((item, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {booking.status === 'pending' && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => alert('Booking cancellation functionality')}
                        className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        Cancel Booking
                      </button>
                      <button
                        onClick={() => alert('Modify booking functionality')}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Modify
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any bookings yet. Browse amenities to make a booking.
              </p>
              <button
                onClick={() => setShowMyBookings(false)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Browse Amenities
              </button>
            </div>
          )}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <div className="flex flex-wrap gap-2">
          {locations.map((location) => {
            const Icon = location.icon;
            return (
              <button
                key={location.value}
                onClick={() => setSelectedLocation(location.value)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedLocation === location.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {location.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAmenities.map((amenity) => {
          const statusColor = getStatusColor(amenity);
          const statusText = getStatusText(amenity);
          const occupancyRate = Math.round((amenity.currentOccupancy / (amenity.capacity || 1)) * 100);

          const statusClasses = {
            green: 'bg-green-100 text-green-800',
            yellow: 'bg-yellow-100 text-yellow-800',
            red: 'bg-red-100 text-red-800'
          };

          return (
            <div key={amenity.id} className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{amenity.name}</h3>
                    <p className="text-sm text-gray-500">{amenity.code}</p>
                  </div>
                  <div className="flex space-x-2">
                    {amenity.requiresApproval && (
                      <div className="group relative">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <div className="absolute right-0 mt-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          Requires admin approval
                        </div>
                      </div>
                    )}
                    {amenity.requiresGuardian && (
                      <div className="group relative">
                        <Users className="h-5 w-5 text-blue-500" />
                        <div className="absolute right-0 mt-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          Guardian supervision required
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClasses[statusColor]}`}>
                    {statusText}
                  </span>
                </div>

                {amenity.capacity && amenity.capacity > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Occupancy</span>
                      <span>{amenity.currentOccupancy}/{amenity.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          statusColor === 'green' ? 'bg-green-500' :
                          statusColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{occupancyRate}% occupied</p>
                  </div>
                )}

                {amenity.requiresPayment && amenity.pricePerHour && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      ₹{amenity.pricePerHour}/hour
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  {amenity.type === 'reservation' && amenity.isAvailable && amenity.maintenanceStatus === 'operational' && (
                    <button
                      onClick={() => setSelectedAmenityForBooking(amenity)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Now
                    </button>
                  )}

                  {amenity.type === 'open-access' && amenity.isAvailable && amenity.maintenanceStatus === 'operational' && occupancyRate < 100 && (
                    <button
                      onClick={() => handleCheckIn(amenity.id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Check In
                    </button>
                  )}

                  {amenity.type === 'monitoring' && (
                    <div className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Walk In
                    </div>
                  )}

                  {user?.role === 'admin' && (
                    <button
                      onClick={() => setSelectedAmenityForAdmin(amenity)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      title="Manage amenity"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {amenity.equipment && amenity.equipment.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-700 mb-2">Available Equipment:</p>
                    <div className="flex flex-wrap gap-1">
                      {amenity.equipment.slice(0, 3).map((item, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                      {amenity.equipment.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{amenity.equipment.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredAmenities.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No amenities found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No amenities are available for the selected location.
          </p>
        </div>
      )}

      {selectedAmenityForBooking && (
        <BookingModal
          amenity={selectedAmenityForBooking}
          onClose={() => setSelectedAmenityForBooking(null)}
          onBook={handleBooking}
          userApartment={user?.apartmentNo || 'N/A'}
        />
      )}

      {selectedAmenityForAdmin && (
        <AdminAmenityModal
          amenity={selectedAmenityForAdmin}
          onClose={() => setSelectedAmenityForAdmin(null)}
          onUpdate={updateAmenity}
          onDelete={deleteAmenity}
        />
      )}
    </div>
  );
}
