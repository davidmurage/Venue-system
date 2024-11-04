import { cancelBooking, createBooking, getBooking, getUserBookings, requestBookingCancel, sendingBookingEmail } from "../controllers/bookingController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post('/create-bookings',requireSignIn, createBooking);

router.get('/get-bookings',requireSignIn, isAdmin, getBooking);

router.get('/get-myBookings', requireSignIn,   getUserBookings);

router.post('/sendEmail',requireSignIn, isAdmin, sendingBookingEmail);

router.delete('/delete-booking/:id', requireSignIn, isAdmin, cancelBooking);

router.post('/request-cancel', requireSignIn, requestBookingCancel);


export default router;

