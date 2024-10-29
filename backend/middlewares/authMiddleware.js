import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//protected Routes token base
export const requireSignIn = async(req, res, next) => {
    try{
      const token = req.header('authorization').replace('Bearer ', '');
      const decode = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(error){
        console.log(error);
    }   
}

//admin access
export const isAdmin = async (req, res, next) => {
    try {
      console.log(req.user);
      const id = req.user._id;
      const user = await userModel.findById({ _id: id});
      console.log(user);
      if (user.role !== 1) {
        return res.status(401).send({
          success: false,
          message: "UnAuthorized Access",
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({
        success: false,
        error,
        message: "Error in admin middelware",
      });
    }
  };