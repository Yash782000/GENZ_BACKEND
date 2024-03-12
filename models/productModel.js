const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const productSchema = mongoose.Schema({
     name:{
        type:String,
        required:[true,"Please add a Name"],
        trim:true,
     },
     sku:{
        type:String,
        required:true,
        default:"sku",
        trim:true
     },
     category:{
        type:String,
        required:[true,"Please add a category"],
        trim:true
     },
     brand:{
        type:String,
        required:[true,"Please add a Brand"],
        trim:true
     },
     color:{
        type:String,
        required:[true,"Please add a color"],
        default:'As seen',
        trim:true,
        
     },
     quantity:{
        type:Number,
        required:[true,"please add a quantity"],
        trim:true
     },
     sold:{
        type:Number,
        default:0,
        trim:true
     },
     regularPrice:{
        type:Number,
        trim:true
     },
     price:{
        type:Number,
        required:[true,"Please add a Price"],
        trim:true
     },
     description:{
        type:String,
        required:[true,"Please add a Description"],
        trim:true
     },
     image:{
        type:[String],
     },
     ratings:{
        type:[Object]
     },
},{
    timestamps:true
})


const Product = mongoose.model("Product",productSchema);

module.exports = Product;