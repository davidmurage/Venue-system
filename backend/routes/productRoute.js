import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { 
    
    createProductController, 
    deleteProductController, 
    getProductController, 
    getSingleProductController, 
    productCategoryController, 
    productCountController, 
    productFiltersControlller, 
    productListController, 
    productPhotoController,
    relatedProductController,
    searchProductController,
    updateProductController
} from "../controllers/productController.js";
import formidable from "express-formidable";



const router = express.Router();


//create product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

//update product   
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

//get all products
router.get('/get-product', getProductController);

//get single products
router.get('/get-product/:slug', getSingleProductController);

//get photo
router.get('/product-photo/:pid', productPhotoController);

//delete product
router.delete('/delete-product/:pid', deleteProductController);

//filter product
router.post('/product-filters', productFiltersControlller );

//product count
router.get('/product-count', productCountController);

//product list based on page
router.get('/product-list/:page', productListController);

//search product
router.get('/search/:keyword', searchProductController);

//similar product
router.get('/related-product/:pid/:cid', relatedProductController);

//category wise product
router.get('/product-category/:slug', productCategoryController);



export default router;