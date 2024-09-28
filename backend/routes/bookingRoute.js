import { createBooking, getBooking } from "../controllers/bookingController";
import express from "express";

const router = express.Router();

router.post('/bookings', createBooking);

router.get('/bookings', getBooking);

module.exports = router;