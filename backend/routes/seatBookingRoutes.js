import express from 'express';
import { bookSeat, getMyBookings, getSeatBookings, cancelBooking } from '../controllers/seatBookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getSeatBookings).post(protect, bookSeat);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id/cancel').put(protect, cancelBooking);

export default router;
