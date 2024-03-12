;const asyncHandler = require("express-async-handler")
const Product = require("../models/productModel");
const { default: mongoose } = require("mongoose");


const createProduct = asyncHandler (async (req,res)=>{
    const {name,sku,category,brand,quantity,description,image,regularPrice,price,color} = req.body;

    if(!name || !category || !brand || !quantity || !price || !description){
        res.status(400);
        throw new Error("Please fill all required fields");
    }
    //create product
    const product = await Product.create({
        name,sku,category,brand,quantity,description,image,regularPrice,price,color
    })
    res.status(201).json(product);
})  

const getProducts = asyncHandler (async(req,res)=>{
    console.log(req.body);
    const product = await Product.find().sort("-createdAt");
    res.status(200).json(product);
})
const getProduct = asyncHandler (async(req,res)=>{
    const products = await Product.findById(req.params.id);
    res.status(200).json(products);
})

//delete Product

const deleteProduct = asyncHandler (async(req,res)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
       res.status(400);
       throw new Error("Product is not in the list")
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"product is deleted"});
})

//update product

const updateProduct = asyncHandler (async(req,res)=>{
    
    const {name,sku,category,brand,quantity,description,image,regularPrice,price,color} = req.body;
    console.log(req.body);
    const product = await Product.findById(req.params.id);
    if(!product){
        res.status(400);
        throw new Error("Product is not in the list")
    }
    const updateProduct = await Product.findByIdAndUpdate(
        {_id:req.params.id},
        {
            name,sku,category,brand,quantity,description,image,regularPrice,price,color
        },
        {
            new:true,
            runValidators:true
        }
    );
    res.status(200).json(updateProduct);
})

//Review Product

const reviewProduct = asyncHandler(async(req,res)=>{
    console.log(req.user);
   const {star,review,reviewDate} = req.body;
   const {id} = req.params;

   if(star<1 || !review){
    res.status(400);
    throw new Error("Please add a start and review")
   }
   const product = await Product.findById(id);
   if(!product){
    res.status(400);
    throw new Error("Product not find")
   }

   //update ratings
   product.ratings.push({
    star,
    review,
    reviewDate,
    name:req.user.name,
    userID:req.user._id
   })
   await product.save();
   res.status(200).json({message:"Product review added"})
})

//delete review

const deleteReview = asyncHandler (async(req,res)=>{
    const {userID} = req.body;
    const {id} = req.params;
    if(star<1 || !review){
        res.status(400);
        throw new Error("Please add a start and review")
       }
    const product = await Product.findById(id);

    if(!product){
        res.json(400);
        throw new Error("product is not defined")
    }
    const newRating = product.ratings.filter((rating)=>{
        return rating.userID.toString() !== userID.toString();
    })
    product.ratings = newRating;
    product.save();
    res.status(200).json({message:"rating is deleted"})
})

//update review

const updateReview = asyncHandler (async(req,res)=>{
    const {star,review,reviewDate,userID} = req.body;
    const {id} = req.params;
    if(star<1 || !review){
        res.status(400);
        throw new Error("Please add a start and review");
       }
    const product = await Product.findById(id);
    if(!product){
        res.json(400);
        throw new Error("product is not defined")
    }

    //Match user to review

    if(req.user._id.toString() !== userID){
          res.status(401);
          throw new Error("User is not authorized")
    }

    const updateReview = await Product.findOneAndUpdate(
        {
        _id:product._id,
        "ratings.userID":mongoose.Types.ObjectId(userID)
       },
       {
        $set:{
            "ratings.$.star":star,
            "ratings.$.review":review,
            "ratings.$.reviewDate":reviewDate
        }
       }
    )
   if(updateReview){
      res.status(200).json({message:"Product updated"});
   }else{
      res.status(200).json({message:"Product is not  updated"});
   }
})
module.exports ={
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    reviewProduct,
    deleteReview,
    updateReview
}