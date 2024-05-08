import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
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
export const deleteProductController = async(req, res) => {
    try{
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({success: true, message: "Product deleted successfully"});
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in deleting product", error});
    }
}


//update product
export const updateProductController = async(req, res) => {
    try{
        const { name, description, price, category, quantity, shipping } = req.fields;
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
        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
            );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({ success: true, message: "Product updated successfully", products });
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in updating product", error});
    }
};
    
//filter product
export const productFiltersControlller = async(req, res) => {
    try{
        const { checked, radio} = req.body;
        let args = {};
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]};
        const products = await productModel.find(args)
    
         res.status(200).send({success: true, message: "Filtered products", products});   
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in filtering product", error});
    }
};

//product count
export const productCountController = async(req, res) => {
    try{
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({success: true, message: "Product count", total});
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting product count", error});
    }
};

//product list based on page
export const productListController = async(req, res) => {
    try{
        const perPage = 3;
        const page = req.params.page? req.params.page : 1;
        const products = await productModel
        .find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({createdAt: -1});
        res.status(200).send({success: true, message: "Product list", products});
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting product list", error});
    }
};

//search product
export const searchProductController = async(req, res) => {
    try{
        const {keyword} = req.params;
        const results = await productModel.find
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

//related product
export const relatedProductController = async(req, res) => {
    try{
        const {pid, cid} = req.params;
        const products = await  productModel
            .find({_id: {$ne: pid}, category: cid})
            .select('-photo')
            .limit(3)
            .populate('category');

            res.status(200).send({success: true, message: "Related products", products});
        
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting related products", error});
    }
};

//category wise product
export const productCategoryController = async(req, res) => {
    try{
        const category = await categoryModel.findOne({slug: req.params.slug});
        const products = await productModel.find({category}).populate("category");

        res.status(200).send({success: true, message: "Category wise products", products, category});
    }catch(error){
        console.log(error);
        res.status(500).send({success: false, message: "Error in getting category wise products", error});
    }
};