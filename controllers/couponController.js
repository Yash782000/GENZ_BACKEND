const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");


const createCoupon = asyncHandler(async(req,res)=>{
    
    const {name,discount,expiresAt} = req.body;
    console.log(name,discount,expiresAt);
    if(!name || !discount || !expiresAt){
        res.status(400);
        throw new Error("Please fill in all category name");
    }
    const coupon = await Coupon.create({
        name,
        discount,
        expiresAt,
    })
    console.log(coupon);
    res.status(200).json(coupon);
})

//get Coupons

const getCoupons = asyncHandler (async(req,res)=>{
    const coupon = await Coupon.find().sort("-createdAt");
    res.status(200).json(coupon);
})

//get coupon
const getCoupon = asyncHandler(async(req,res)=>{
    const couponName = req.params.couponName;
    console.log(couponName);
    const coupon =await  Coupon.findOne({
        name:couponName,
        expiresAt:{$gt:Date.now()}

    })
    if(!coupon){
        console.log("hyy")
        res.status(404).json("coupon is expired")
    }
    else{
        console.log(coupon);
        res.status(200).json(coupon);
    }
})

//delete Coupoun
const deleteCoupon = asyncHandler (async(req,res)=>{
   const coupon  = await Coupon.findByIdAndDelete(req.params.id);
   if(!coupon){
    res.status(404).json("coupon is not existed")
   }
   res.status(200).json({message:"coupon is deleted"});
})


module.exports = {
    createCoupon,
    getCoupon,
    getCoupons,
    deleteCoupon
}