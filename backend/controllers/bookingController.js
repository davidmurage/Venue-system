import Booking from "../models/bookingModel.js";

export const createBooking = async(req,res) =>{
    try {
        const {name,email,venue,date,time} = req.body;

        const userId = req.user._id;

        const booking = new Booking({
            name,
            email,
            venue,
            date,
            time,
            user: userId
        });
        await booking.save();
        res.json({message:"Booking successful"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong"});
    }
}

export const getBooking = async(req,res) =>{
    try {
        const bookings = await Booking.find();
        res.json({bookings});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong"});
    }
}

export const getUserBookings = async(req, res) => {
    try {
        const userId = req.user._id
        const bookings = await Booking.find({user:userId});
        res.status(200).json({success: true, bookings});
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Something went wrong"});
    }
}