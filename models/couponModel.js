const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"please add a coupon"],
        trim:true,
        upperCase:true,
        minlength:[6,"coupon must be 6 words"],
        maxlength:[12,"coupon must be 12 words"]
    },
    discount:{
        type:Number,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
},{timestamps:true})

const Coupon = mongoose.model("coupon",couponSchema);

module.exports = Coupon;