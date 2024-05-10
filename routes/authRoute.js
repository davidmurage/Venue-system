import express from 'express';
import { 
    registerController, 
    loginController, 
    forgotPasswordController, 
    testController, 
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController} 
    from '../controllers/authController.js';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';


//router object
const router = express.Router();

//routing

//REGISTER || METHOD POST
router.post('/register', registerController);

//LOGIN || METHOD POST
router.post('/login', loginController);

//FORGOT PASSWORD || POST
router.post('/forgot-password', forgotPasswordController)

//test routes
router.get('/test', requireSignIn, isAdmin, testController);

//protected User routes-auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok:true})
});

//protected Admin routes-auth
router.get('/admin-auth', requireSignIn, isAdmin,  (req, res) => {
    res.status(200).send({ok:true})
});

//update profile
router.put('/profile', requireSignIn, updateProfileController);

//orders
router.get('/orders', requireSignIn, getOrdersController);

//get all orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

//order-status
router.get('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);

export default router;
