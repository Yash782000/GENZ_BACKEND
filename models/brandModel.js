const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
    name :{
        type:String,
        unique:true,
        trim:true,
        required:"Name is required",
        minlength:[2,"too short"],
        maxlength:[32,"too long"]
     },
     slog:{
        type:String,
        unique:true,
        lowercase:true,
        index:true,
     },
     category:{
        type:String,
        required:true
     }
},{timestamps:true})


const Brand = mongoose.model("brand",brandSchema);

module.exports = Brand;