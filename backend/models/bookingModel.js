import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venues",
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: false
  }
  
});

export default mongoose.model('Booking', BookingSchema);
