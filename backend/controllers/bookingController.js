import Booking from "../models/bookingModel.js";
import venueModel from "../models/venueModel.js"; // Corrected import

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { name, email, venueId, date, time } = req.body;
    const userId = req.user._id;

    // Fetch venue details using findById
    const venue = await venueModel.findById(venueId).select("name photo");
    
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }

    const booking = new Booking({
      name,
      email,
      venue: venueId,
      venueName: venue.name,
      venuePhoto: venue.photo,
      date,
      time,
      user: userId,
    });

    await booking.save();
    res.status(201).json({ success: true, message: "Booking successful", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all bookings with populated venue details
export const getBooking = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("venue", "name photo");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get user-specific bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId }).populate("venue", "name photo");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Cancel a booking with authorization check
export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;

    // Ensure booking belongs to the user before deleting
    const booking = await Booking.findOneAndDelete({ _id: bookingId, user: userId });

    if (!booking) {
      return res.status(400).json({ error: "Booking not found or Unauthorized" });
    }
    res.status(200).json({ success: true, message: "Booking cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
