import Booking from "../models/bookingModel.js";
import venueModel from "../models/venueModel.js"; // Corrected import
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    tls: {
        rejectUnauthorized: false, // This allows self-signed certificates
      },
})

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
    
        const booking = await Booking.findByIdAndDelete(bookingId);
        if (!booking) {
          return res.status(404).json({ error: 'Booking not found' });
        }
    
        res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to cancel booking' });
      }
};

//sending emails
export const sendingBookingEmail = async(req, res) =>{
    try{
        const{bookingId, email}=req.body;
        const booking = await Booking.findById(bookingId).populate('venue');
        if(!booking){
            return res.status(404).send({message: "Booking not found"});
        }
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Venue Booking Confirmation",
            text: `Hello ${booking.name}, Your booking for ${booking.venue ? booking.venue.name : "Venue Name Unavailable"} on ${booking.date} at ${booking.time} has been confirmed.`
        }
        await transporter.sendMail(mailOptions);
        res.status(200).send({success:true, message: "Email sent successfully"});
    }catch(error){
        console.log(error);
        res.status(500).send({success:false, message: "Error in sending email", error});
    }
}

//booking cancellation by users
export const requestBookingCancel = async(req, res) =>{
  try{
    const {bookingId, email} = req.body;
    const booking = await Booking.findById(bookingId).populate("venue");

    if(!booking){
      return res.status(404).json({error: "Booking not found"});
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "Booking Cancellation Request",
      text: `User ${booking.name} has requested cancellation for the booking of venue ${booking.venue.name} on ${new Date(booking.date).toDateString()} at ${booking.time}. User email: ${email}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Cancellation request sent to admin' });

  }catch(error){
    console.log(error);
    res.status(400).send({success:false, message: "Failure in cancelling the booking"});
  }
}
