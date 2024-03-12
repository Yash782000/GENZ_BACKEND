const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const { default: slugify } = require("slugify");


const createCategory = asyncHandler (async(req,res)=>{
    console.log(req.body.name);
    const {name} = req.body;
    if(!name){
        res.status(400);
        throw new Error("Please fill in all category name");
    }
    const categoryExists = await Category.findOne({name});
    if(categoryExists){
        res.status(400);
        throw new Error("category exists already")
    }
    const category = await Category.create({
        name,
        slog:slugify(name)
    })
    res.status(200).json(category);
})


//get Category

const getCategory = asyncHandler (async(req,res)=>{
    
    const categories = await Category.find().sort("-createdAt");
    res.status(200).json(categories);
})

//delete Category

const deleteCategory = asyncHandler (async(req,res)=>{
    const slog = req.params.slog.toLowerCase();
    const category = await Category.findOneAndDelete({
        slog
    })
    if(!category){
        res.status(400);
        throw new Error("Category doesnt exists")
    }
    res.status(200).json({message:"category delted"});

})


module.exports = {
    createCategory,
    getCategory,
    deleteCategory
}