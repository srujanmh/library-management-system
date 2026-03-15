import SeatBooking from '../models/SeatBooking.js';

// @desc    Book a seat
// @route   POST /api/seats
// @access  Private
export const bookSeat = async (req, res) => {
  const { seatNumber, date, timeSlot } = req.body;

  // Check if seat is already booked for that date and time slot
  const existingBooking = await SeatBooking.findOne({
    seatNumber,
    date,
    timeSlot,
    status: 'Booked'
  });

  if (existingBooking) {
    return res.status(400).json({ message: 'Seat is already booked for this time slot' });
  }

  const booking = new SeatBooking({
    user: req.user._id,
    seatNumber,
    date,
    timeSlot,
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
};

// @desc    Get user's seat bookings
// @route   GET /api/seats/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
  const bookings = await SeatBooking.find({ user: req.user._id });
  res.json(bookings);
};

// @desc    Get all seat bookings (Admin) or check availability
// @route   GET /api/seats
// @access  Public
export const getSeatBookings = async (req, res) => {
  const { date } = req.query;
  const filter = date ? { date, status: 'Booked' } : {};
  const bookings = await SeatBooking.find(filter).populate('user', 'name');
  res.json(bookings);
};

// @desc    Cancel a seat booking
// @route   PUT /api/seats/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  const booking = await SeatBooking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    return res.status(401).json({ message: 'Not authorized' });
  }

  booking.status = 'Cancelled';
  await booking.save();

  res.json({ message: 'Booking cancelled' });
};
