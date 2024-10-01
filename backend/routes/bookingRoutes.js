import { createBooking, getBooking, getUserBookings } from "../controllers/bookingController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post('/create-bookings',requireSignIn, createBooking);

router.get('/get-bookings', getBooking);

router.get('/get-myBookings', requireSignIn,   getUserBookings);

export default router;

