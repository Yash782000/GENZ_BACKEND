const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = asyncHandler (async(req,res,next)=>{
    try {
     
       const token = req.cookies.token;
       console.log(token);
       if(!token){
        res.status(401);
        throw new Error("Not authorized ,please login")
       } 

       // verify token

       const verified = jwt.verify(token,process.env.JWT_KEY);
       
       //get id from token
    
       const user = await User.findById(verified.id);
       
       if(!user){
        res.status(401);
        throw new Error("User not found");
       }
       req.user = user;
       next();

    } catch (error) {
       
        res.status(401);
        throw new Error("Not authorized ,please login")
    }
})

//Admin Only

const adminOnly = (req,res,next) =>{
    if(req.user && req.user.role){
        next()
    }
    else{
        res.status(401);
        throw new Error("User is not authorized as an Admin")
    }
}




module.exports = {
    protect,
    adminOnly
}