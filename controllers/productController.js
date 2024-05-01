import productModel from "../models/productModel.js";
import slugify from "slugify";
import fs from "fs";


//create product 
export const createProductController = async (req, res) => {
    try{
        const { name, description, price, category, quantity, shipping } = req.fields;
        const {photo} = req.files;

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

            case photo && photo.size > 1000000:
                return res.status(500).json({error: "Photo is required and should be less than 1mb"});
        }

        const products = new productModel({...req.fields, slug: slugify(name)});
        
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({success: true, message: "Product created successfully", products});
            
        
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in creating product", error})
    }
};