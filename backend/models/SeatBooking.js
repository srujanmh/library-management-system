import mongoose from 'mongoose';

const seatBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  seatNumber: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String, // e.g., "10:00 AM - 12:00 PM"
    required: true,
  },
  status: {
    type: String,
    enum: ['Booked', 'Cancelled'],
    default: 'Booked',
  }
}, {
  timestamps: true,
});

const SeatBooking = mongoose.model('SeatBooking', seatBookingSchema);
export default SeatBooking;
