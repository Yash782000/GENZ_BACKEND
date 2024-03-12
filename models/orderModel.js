const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    orderDate:{
        type:String,
        required:[true,"Please add a order Date"],
        trim:true
    },
    orderAmount:{
        type:String,
        required:[true,"Please add a order Amount"],
        trim:true
    },
    orderStatus:{
        type:String,
        required:[true,"Please add a order status"],
        trim:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    cartItems:{
        type:[Object],
        required:[true]
    },
    shippingAddress:{
        type:Object,
        required:true
    },
    coupon:{
        type:Object,
        required:true,
        default:{
            name:"nil"
        },
    }
},{timestamps:true})


const Order = mongoose.model("Order",orderSchema);

module.exports = Order;