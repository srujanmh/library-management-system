import React, { useState, useEffect } from 'react';
import StudentLayout from '../../components/layouts/StudentLayout';
import api from '../../services/api';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle } from 'lucide-react';

const defaultTimeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM"
];

const StudentSeats = () => {
    const [bookings, setBookings] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [seatNumber, setSeatNumber] = useState(1);
    const [timeSlot, setTimeSlot] = useState(defaultTimeSlots[0]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchMyBookings = async () => {
        try {
            const { data } = await api.get('/seats/mybookings');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMyBookings();
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/seats', { seatNumber, date, timeSlot });
            setSuccess('Seat booked successfully!');
            fetchMyBookings();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book seat');
        }
    };

    const handleCancel = async (id) => {
        if(window.confirm('Cancel this booking?')) {
            try {
                await api.put(`/seats/${id}/cancel`);
                fetchMyBookings();
            } catch {
                alert('Error cancelling booking');
            }
        }
    };

    return (
        <StudentLayout>
            <div className="p-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">Library Seat Booking</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Booking Form */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden lg:col-span-1">
                        <div className="bg-indigo-600 p-6 text-white text-center">
                            <CalendarIcon size={32} className="mx-auto mb-3 opacity-90" />
                            <h3 className="text-xl font-bold">Reserve a Seat</h3>
                        </div>
                        <div className="p-6">
                            {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm flex items-center gap-2"><XCircle size={16}/> {error}</div>}
                            {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm flex items-center gap-2"><CheckCircle size={16}/> {success}</div>}
                            
                            <form onSubmit={handleBook} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                                    <input 
                                        type="date" 
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" 
                                        value={date} 
                                        onChange={e => setDate(e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot</label>
                                    <select 
                                        required 
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" 
                                        value={timeSlot} 
                                        onChange={e => setTimeSlot(e.target.value)}
                                    >
                                        {defaultTimeSlots.map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Seat Number (1-50)</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max="50"
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" 
                                        value={seatNumber} 
                                        onChange={e => setSeatNumber(e.target.value)} 
                                    />
                                </div>
                                <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition-all active:scale-[0.98]">
                                    Confirm Booking
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* My Bookings List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">My Upcoming Bookings</h3>
                            
                            <div className="space-y-4">
                                {bookings.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Clock size={48} className="mx-auto mb-3 opacity-20" />
                                        <p>You have no seat bookings.</p>
                                    </div>
                                ) : (
                                    bookings.map((booking) => (
                                        <div key={booking._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-gray-50 group">
                                            <div className="mb-4 sm:mb-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">
                                                        Seat {booking.seatNumber}
                                                    </span>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                                                        booking.status === 'Booked' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="text-gray-600 text-sm flex items-center gap-4 mt-2">
                                                    <span className="flex items-center gap-1"><CalendarIcon size={14}/> {new Date(booking.date).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><Clock size={14}/> {booking.timeSlot}</span>
                                                </div>
                                            </div>
                                            {booking.status === 'Booked' && (
                                                <button 
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="w-full sm:w-auto px-4 py-2 text-sm text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentSeats;
