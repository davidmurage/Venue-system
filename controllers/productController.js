import productModel from "../models/productModel.js";
import slugify from "slugify";
import fs from "fs";


//create product 
export const createProductController = async (req, res) => {
    try{
        const { name, description, price, category, quantity, shipping } = req.fields;
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

            case photo && photo.size > 3000000:
                return res.status(500).json({error: "Photo is required and should be less than 3mb"});
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

//get all products
export const getProductController = async(req, res) => {
    try{
        const products = await productModel
        .find({})
        .populate("category")
        .select("-photo")
        .limit(12)
        .sort({createdAt: -1});
        res.status(200).send({success: true,countTotal: products.length, message:'All products', products});
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting products", error});
    }
};

//get single product
export const getSingleProductController = async(req, res) => {
    try{
        const product = await productModel
        .findOne({slug: req.params.slug})
        .select("-photo")
        .populate("category");
        res.status(200).send({success: true, message: "Single product fetched", product});
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting single product", error});
    }
};

//product photo
export const productPhotoController = async(req, res) => {
    try{
        const product = await productModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            res.set("Content-Type", product.photo.contentType);
            return res.send(product.photo.data);
        }
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting product photo", error});
    }
};

//delete product
export const deleteProductController = async(req, res) => {}
    