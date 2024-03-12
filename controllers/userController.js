const asyncHandler = require("express-async-handler");
const User = require("../models/userModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_KEY,{
         expiresIn:"1d"
    })
}

// Define the registerUser route handler function
const registerUser = asyncHandler(async (req, res) => {
    const {name,email,password,role} = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please fill in all required fields");
    }
    if(password.length<6){
        res.status(400);
        throw new Error("Password must be upto 6 characters");
    }
    const userExist = await User.findOne({email});
    if(userExist){
        res.status(400);
        throw new Error("Email has already been registered");
    }

    //create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    const token  = generateToken(user._id);
    if(user){
        const {_id,name,email,password,role} = user;
          res.cookie("token",token,{
            path:"/",
            httpOnly:true,
            expires: new Date(Date.now() + 1000 * 86400),
           // secure:true,
           // sameSite:none
          })
          res.status(201).json({
            _id,name,email,password,role,token
          })
    }else{
        res.status(400);
        throw new Error("Invalid user data")
    }
});


const loginUser = asyncHandler (async (req,res)=>{
    const {email,password} = req.body;
     // Validation
    if(!email || !password){
       res.status(400);
       throw new Error("Please fill all required fields")
    }

    // checks email
    const user =await User.findOne({email});

    if(!user){
        res.status(400);
        throw new Error("Invalid email");
    }
 
    // check password
    const passwordCheck = await bcrypt.compare(password,user.password);

    //generate token
    const token  = generateToken(user._id);

    if(user && passwordCheck){
        const newUser =await User.findOne({email}).select("-password")
        res.cookie("token",token,{
            path:"/",
            httpOnly:true,
            expires:new Date(Date.now()+1000*86400)
        })
        res.status(201).json(newUser);
    }else{
        res.status(400);
        throw new Error("Invalid Credentials")
    }

    res.json("Login here")
})

const logOut = asyncHandler (async(req,res)=>{
    res.cookie("token","",{
        path:"/",
        httpOnly:true,
        expires:new Date(0),

    });
    res.status(200).json({message:"successfully loged out"})
})

const getUser = asyncHandler (async (req,res)=>{
     const user =await  User.findById(req.user._id).select("-password");
    if(user){
       res.status(200).json(user);
    }else{
        res.status(400);
        throw new Error("User not found");
    }
})

const getLoginStatus = asyncHandler (async(req,res)=>{
    const token = req.cookies.token;
    console.log(token);
    if(!token){
       return  res.json(false);
    }
    const verified = jwt.verify(token,process.env.JWT_KEY);
    if(verified){
        res.json(true);
    }else{
        res.json(false);
    }
})

const updateUser = asyncHandler (async (req,res)=>{
    const user  =await  User.findById(req.user._id);
    console.log(user.name);
    if(user){
        const {name,phone,password,address} = user;
        user.name = req.body.name || name;
       
        user.phone = req.body.phone || phone;
        user.password = req.body.password || password;
        user.address = req.body.address || address;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    }else{
        res.status(404);
        throw new Error("User not found")
    }

})

// update Photo

const updatePhoto = asyncHandler (async(req,res)=>{
    console.log(req.body);
    const {photo} = req.body;

    const user = await User.findById(req.user._id);
    user.photo = photo;
    const updatedPhoto = await user.save();
    res.status(200).json(updatedPhoto);
    
})

//save cart
const saveCart = asyncHandler(async(req,res)=>{
    const {cartItems} = req.body;
    const user = await  User.findById(req.user._id);
    if(user){
       user.cartItems = cartItems;
       user.save();
       res.status(200).json({message:"Cart Saved"})
    }else{
      res.status(400);
      throw new Error("User not found");
    }
})

//get cart

const getCart = asyncHandler (async(req,res)=>{
    const user = await User.findById(req.user._id);
    if(user){
       res.status(200).json(user.cartItems)
    }else{
      res.status(400);
      throw new Error("User not found");
    }
})
module.exports = {
    registerUser,
    loginUser,
    logOut,
    getUser,
    getLoginStatus,
    updateUser,
    updatePhoto,
    saveCart,
    getCart,
};
