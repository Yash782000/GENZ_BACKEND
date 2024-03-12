const mongoose  = require("mongoose");

const categorySchema = mongoose.Schema({
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
},{timestamps:true});


const Category = mongoose.model("category",categorySchema);

module.exports = Category;