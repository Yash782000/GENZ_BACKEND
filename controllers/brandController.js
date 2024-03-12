const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const { default: slugify } = require("slugify");
const Brand = require("../models/brandModel");


const createBrand = asyncHandler(async(req,res)=>{
    const {name,category} = req.body;
    if(!name || !category){
        res.status(400);
        throw new Error("Please fill in all category name");
    }
    const categoryExists = await Category.findOne({name:category});
    if(!categoryExists){
        res.status(400);
        throw new Error("category already existed")
    }
    const brand = await Brand.create({
        name,
        slog:slugify(name),
        category
    })
    res.status(200).json({brand});
})

//get Brand

const getBrand = asyncHandler(async(req,res)=>{
    const brand = await Brand.find().sort("-createdAt");
    res.status(200).json(brand);
})


//deleteBrand

const deleteBrand = asyncHandler (async(req,res)=>{
    const slog = req.params.slog.toLowerCase();
    const brand = await Brand.findOneAndDelete({slog});
    if(!brand){
        res.status(400);
        throw new Error("Brand is not existed")
    }
    res.status(200).json({message:"brand is deleted"})
})

module.exports = {
    createBrand,
    getBrand,
    deleteBrand
}