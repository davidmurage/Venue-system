import venueModel from "../models/venueModel.js";
import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
import fs from "fs";
import axios from 'axios';

import dotenv from "dotenv";
import generateMpesaToken from "../middlewares/MpesaToken.js";

dotenv.config();



//create venue 
export const createVenueController = async (req, res) => {
    try{
        const { name, description, price, category, quantity } = req.fields;
        const { photo } = req.files;

        //validation
        switch(true){
            case !name:
                return res.status(500).json({error: "Name is required"});
            case !description:
                return res.status(500).json({error: "Description is required"});
            case !price:
                return res.status(500).json({error: "Price is required"});
            case !category:
                return res.status(500).json({error: "Category is required"});
            case !quantity:
                return res.status(500).json({error: "Quantity is required"});

            case photo && photo.size > 5000000:
                return res.status(500).json({error: "Photo is required and should be less than 1mb"});
        }

        const venues = new venueModel({...req.fields, slug: slugify(name)});
        
        if(photo){
            venues.photo.data = fs.readFileSync(photo.path);
            venues.photo.contentType = photo.type;
        }
        await venues.save();
        res.status(201).send({success: true, message: "Venue created successfully", venues});
            
        
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in creating venue", error})
    }
};

//get all venues
export const getVenueController = async(req, res) => {
    try{
        const venues = await venueModel
        .find({})
        .populate("category")
        .select("-photo")
        .limit(12)
        .sort({createdAt: -1});
        res.status(200).send({success: true,countTotal: venues.length, message:'All venues', venues});
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting venues", error});
    }
};

//get single venue
export const getSingleVenueController = async(req, res) => {
    try{
        const venue = await venueModel
        .findOne({slug: req.params.slug})
        .select("-photo")
        .populate("category");
        res.status(200).send({success: true, message: "Single venue fetched", venue});
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting single venue", error});
    }
};

//venue photo
export const venuePhotoController = async(req, res) => {
    try{
        const venue = await venueModel.findById(req.params.pid).select("photo");
        if (venue && venue.photo && venue.photo.data) {
            const base64Photo = venue.photo.data.toString('base64');
            res.status(200).json({
              contentType: venue.photo.contentType,
              base64Photo: base64Photo,
            });
          } else {
            res.status(404).send('Photo not found');
          }
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting venue photo", error});
    }
};

//delete venue
export const deleteVenueController = async(req, res) => {
    try{
        await venueModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({success: true, message: "Venue deleted successfully"});
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in deleting venue", error});
    }
}


//update venue
export const updateVenueController = async(req, res) => {
    try{
        const { name, description, price, category, quantity} = req.fields;
        const { photo } = req.files;

        //validation
        switch (true) {
            case !name:
              return res.status(500).send({ error: "Name is Required" });
            case !description:
              return res.status(500).send({ error: "Description is Required" });
            case !price:
              return res.status(500).send({ error: "Price is Required" });
            case !category:
              return res.status(500).send({ error: "Category is Required" });
            case !quantity:
              return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
              return res
                .status(500)
                .send({ error: "photo is Required and should be less then 1mb" });
          }
        const venues = await venueModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
            );
        if (photo) {
            venues.photo.data = fs.readFileSync(photo.path);
            venues.photo.contentType = photo.type;
        }
        await venues.save();
        res.status(201).send({ success: true, message: "Venue updated successfully", venues });
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in updating venue", error});
    }
};
    
//filter venue
export const venueFiltersControlller = async(req, res) => {
    try{
        const { checked, radio} = req.body;
        let args = {};
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]};
        const venues = await venueModel.find(args)
    
         res.status(200).send({success: true, message: "Filtered venues", venues});   
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in filtering venue", error});
    }
};

//venue count
export const venueCountController = async(req, res) => {
    try{
        const total = await venueModel.find({}).estimatedDocumentCount();
        res.status(200).send({success: true, message: "Venue count", total});
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting venue count", error});
    }
};

//venue list based on page
export const venueListController = async(req, res) => {
    try{
        const perPage = 3;
        const page = req.params.page? req.params.page : 1;
        const venues = await venueModel
        .find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({createdAt: -1});
        res.status(200).send({success: true, message: "Venue list", venues});
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting venue list", error});
    }
};

//search venue
export const searchVenueController = async(req, res) => {
    try{
        const {keyword} = req.params;
        const results = await venueModel.find
        ({
           $or: [
            {name: {$regex: keyword, $options: "i"}},
            {description: {$regex: keyword, $options: "i"}},
            ],
         }).select("-photo");
        res.status(200).send({success: true, message: "Search results", results});
    }catch(error){
        console.log(error);
        res.json(results);
    }
};

//related venue
export const relatedVenueController = async(req, res) => {
    try{
        const {pid, cid} = req.params;
        const venues = await venueModel
            .find({_id: {$ne: pid}, category: cid})
            .select('-photo')
            .limit(3)
            .populate('category');

            res.status(200).send({success: true, message: "Related venues", venues});
        
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting related venues", error});
    }
};

//category wise venue
export const venueCategoryController = async(req, res) => {
    try{
        const category = await categoryModel.findOne({slug: req.params.slug});
        const venues = await venueModel.find({category}).populate("category");

        res.status(200).send({success: true, message: "Category wise venues", venues, category});
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting category wise venues", error});
    }
};

//payment for venue
export const paymentController = async(req, res) => {
    try{
        const { phoneNumber, amount } = req.body;
        const token = await generateMpesaToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3);
        const password = Buffer.from(`${process.env.DARAJA_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`).toString("base64");
        const response = await axios.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                BusinessShortCode: process.env.DARAJA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: process.env.DARAJA_SHORTCODE,
                PhoneNumber: phoneNumber,
                CallBackURL: "https://yourcallbackurl.com",
                AccountReference: "Test",
                TransactionDesc: "Test",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        res.status(200).send({ success: true, message: "Payment request sent", response });
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in payment", error});
    }
};
