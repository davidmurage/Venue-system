import Booking from "../models/bookingModel.js";
import productModel from "../models/venueModel.js";

export const createBooking = async(req,res) =>{
    try {
        const {name, email, venueId, date, time} = req.body;

        const userId = req.user._id;
        

        //fetch product or venue details
        const venue = await productModel.find(venueId);
        console.log(venue);

        if(!venue){
            return res.status(400).json({error:"Venue not found"});
        }
        
        const booking = new Booking({
            name,
            email,
            venue: venueId,
            venueName: venue.name,
            venuePhoto: venue.photo,
            date,
            time,
            user: userId
        });
        
        console.log(booking)
        await booking.save();
        res.json({message:"Booking successful"});
        console.log(booking);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong"});
    }
}

export const getBooking = async(req,res) =>{
    try {
        const bookings = await Booking.find().populate('venue', 'name photo');
        res.json({bookings});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong"});
    }
}

export const getUserBookings = async(req, res) => {
    try {
        const userId = req.user._id
        const bookings = await Booking.find({user: userId}).populate('venue', 'name photo');
        res.status(200).json({success: true, bookings});
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Something went wrong"});
    }
}

export const cancelBooking = async(req, res) => {
    try{
        const bookingId = req.params.id;
        const userId = req.user._id;

        //ensures the booking belongs to the user
        const booking = await Booking.findOneAndDelete({_id:bookingId, user:userId});

        if(!booking){
            return res.status(400).json({error:"Booking not found or Unauthorized"});
        }
        res.status(200).json({success: true, message: "Booking cancelled"});

    }catch(error){
        console.log(error);
        res.status(500).json({error:"Something went"});
    }
}