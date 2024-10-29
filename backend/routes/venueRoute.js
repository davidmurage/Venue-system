import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { 
    createVenueController, 
    deleteVenueController, 
    getVenueController, 
    getSingleVenueController, 
    paymentController, 
    venueCategoryController, 
    venueCountController, 
    venueFiltersControlller, 
    venueListController, 
    venuePhotoController,
    relatedVenueController,
    searchVenueController,
    updateVenueController
} from "../controllers/venueController.js";
import formidable from "express-formidable";

const router = express.Router();

//create venue
router.post('/create-venue', requireSignIn, isAdmin, formidable(), createVenueController);

//update venue   
router.put('/update-venue/:pid', requireSignIn, isAdmin, formidable(), updateVenueController);

//get all venues
router.get('/get-venue', getVenueController);

//get single venue
router.get('/get-venue/:slug', getSingleVenueController);

//get photo
router.get('/venue-photo/:pid', venuePhotoController);

//delete venue
router.delete('/delete-venue/:pid', deleteVenueController);

//filter venue
router.post('/venue-filters', venueFiltersControlller );

//venue count
router.get('/venue-count', venueCountController);

//venue list based on page
router.get('/venue-list/:page', venueListController);

//search venue
router.get('/search/:keyword', searchVenueController);

//similar venues
router.get('/related-venue/:pid/:cid', relatedVenueController);

//category wise venue
router.get('/venue-category/:slug', venueCategoryController);

//payment
router.post('/payment', requireSignIn, paymentController);

export default router;
