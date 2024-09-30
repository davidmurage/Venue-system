import Booking from "../models/bookingModel.js";

export const createBooking = async(req,res) =>{
    try {
        const {name,email,venue,date,time} = req.body;

        const booking = new Booking({
            name,
            email,
            venue,
            date,
            time
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