import express from 'express';
import { 
    registerController, 
    loginController, 
    forgotPasswordController, 
    testController, 
    updateProfileController,
    getAllUsers,
    approveUser,
    deleteUser,
    restrictUser,
  } 
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

//get-all users
router.get('/get-users',requireSignIn, isAdmin, getAllUsers);

//approve-users
router.put('/approve-user/:id', requireSignIn, isAdmin, approveUser);

//delete users
router.delete('/delete-user/:id', requireSignIn, isAdmin, deleteUser);

//restrict user
router.put('/restrict-user', requireSignIn, isAdmin, restrictUser);




export default router;
