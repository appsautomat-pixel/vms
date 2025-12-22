import React, { useState } from 'react';
import { X, Calendar, Clock, Users, DollarSign, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react';
import { Amenity, Booking } from '../../types';
import { format, addDays } from 'date-fns';

interface BookingModalProps {
  amenity: Amenity;
  onClose: () => void;
  onBook: (booking: Partial<Booking>) => void;
  userApartment: string;
}

export default function BookingModal({ amenity, onClose, onBook, userApartment }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [attendees, setAttendees] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 22) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const calculateDuration = () => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours;
  };

  const calculateTotal = () => {
    if (!amenity.requiresPayment || !amenity.pricePerHour) return 0;
    const duration = calculateDuration();
    return duration * amenity.pricePerHour;
  };

  const handleEquipmentToggle = (equipment: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (endTime <= startTime) {
      alert('End time must be after start time');
      return;
    }

    const booking: Partial<Booking> = {
      amenityId: amenity.id,
      amenityName: amenity.name,
      userApartment,
      date: selectedDate,
      startTime,
      endTime,
      attendees,
      specialRequests: specialRequests || undefined,
      equipment: selectedEquipment.length > 0 ? selectedEquipment : undefined,
      totalAmount: calculateTotal(),
      status: amenity.requiresApproval ? 'pending' : 'confirmed',
      paymentStatus: amenity.requiresPayment ? 'pending' : undefined,
    };

    onBook(booking);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Book {amenity.name}</h2>
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
          {amenity.requiresApproval && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Approval Required</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Your booking request will be reviewed by the facility manager before confirmation.
                </p>
              </div>
            </div>
          )}

          {amenity.requiresGuardian && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
              <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Guardian Required</p>
                <p className="text-sm text-blue-700 mt-1">
                  Adult supervision is mandatory for this amenity.
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="grid grid-cols-7 gap-2">
              {nextSevenDays.map((date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={`flex flex-col items-center p-2 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {format(date, 'EEE')}
                    </span>
                    <span className="text-lg font-semibold mt-1">
                      {format(date, 'd')}
                    </span>
                    <span className="text-xs">
                      {format(date, 'MMM')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Attendees
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                id="attendees"
                min="1"
                max={amenity.capacity}
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value))}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum capacity: {amenity.capacity} people
            </p>
          </div>

          {amenity.equipment && amenity.equipment.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Equipment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {amenity.equipment.map((item) => (
                  <label
                    key={item}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEquipment.includes(item)}
                      onChange={() => handleEquipmentToggle(item)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              id="specialRequests"
              rows={3}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special requirements or notes..."
            />
          </div>

          {amenity.rules && amenity.rules.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Amenity Rules</h4>
              <ul className="space-y-1">
                {amenity.rules.map((rule, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {amenity.requiresPayment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Total Amount</p>
                    <p className="text-xs text-blue-700">
                      {calculateDuration()} hours × ₹{amenity.pricePerHour}/hour
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  ₹{calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>
          )}

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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {amenity.requiresApproval ? 'Request Booking' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
