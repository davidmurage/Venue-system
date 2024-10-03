import { cancelBooking, createBooking, getBooking, getUserBookings } from "../controllers/bookingController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post('/create-bookings',requireSignIn, createBooking);

router.get('/get-bookings', isAdmin, getBooking);

router.get('/get-myBookings', requireSignIn,   getUserBookings);

router.delete('/delete-booking/:id', requireSignIn, cancelBooking);

export default router;

