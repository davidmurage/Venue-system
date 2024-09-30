import { createBooking, getBooking } from "../controllers/bookingController.js";
import express from "express";

const router = express.Router();

router.post('/create-bookings', createBooking);

router.get('/get-bookings', getBooking);

export default router;

