const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const { calculateTotalPrice, updateProductQuantity } = require("../utlis");

const sendEmail = require("../utlis/sendEmail");
const { orderSuccessEmail } = require("../emailTemplate/orderTemplate");
const stripe = require("stripe")(process.env.STRIPE_SECRETKEY);

const createOrder = asyncHandler (async(req,res)=>{
   
    
    const {
        orderDate,
        orderAmount,
        orderStatus,
        paymentMethod,
        cartItems,
        shippingAddress,
        coupon
    } = req.body;
    if(!orderAmount || !orderStatus || !cartItems || !shippingAddress){
        res.status(400);
        throw new Error("Please fil all required fields");
    }
    //update product quantity
    
    await Order.create({
        user:req.user._id,
        orderDate,
        orderAmount,
        orderStatus,
        paymentMethod,
        cartItems,
        shippingAddress,
        coupon
    })
    await updateProductQuantity(cartItems);
    //send Order email to the user
    const subject = "New Order Placed --GenzStore"
    const send_to = req.user.email;
    const template = orderSuccessEmail(req.user.name,cartItems);
    console.log(template);
    const replay_to = "noreply@genzStore.com"

    await sendEmail(subject,send_to,template,replay_to);
    res.status(201).json({message:"order created"});
})

//get orders 

const getOrders = asyncHandler (async(req,res)=>{
   let orders;
   if(req.user.role === "admin"){
    orders = await Order.find().sort("-createdAt");
    return res.status(200).json(orders);
   }
   orders = await Order.find({user:req.user._id});
   return res.status(200).json(orders);
})

//get order
const getOrder = asyncHandler (async(req,res)=>{
   
    const order = await Order.findById(req.params.id);
    if(!order){
        res.status(400).json("order not found")
    }
    console.log(order.user?.toString())
    console.log(req.user?._id)
    if(req.user?.role === "admin"){
        console.log("hy")
        return res.status(200).json(order);
    }
    if(order.user.toString() !== req.user?._id.toString()){
       res.status(401);
       throw new Error("user not authorized");
    }
    res.status(200).json(order);
})

//updateOrderStatus

const updateOrderStatus = asyncHandler (async(req,res)=>{
   const {orderStatus} = req.body;
   const {id} = req.params;
   
   const order = await Order.findById(id);
   if(!order){
    res.status(400);
    throw new Error("order not found");
   }

   //update the order status
   await Order.findByIdAndUpdate(
    {_id:id},
    {
        orderStatus
    },
    {
        new:true,
        runValidators:true,
    }
   )
   res.status(200).json({message:"order status is updated"});
})
//pay with stripe

const payWithStripe = asyncHandler(async (req, res) => {
    console.log("hy");
    const { items, shipping, description, coupon } = req.body;

    // Fetch products from the database
    const products = await Product.find();

    // Calculate total order amount based on items
    let orderAmount = calculateTotalPrice(products, items);

    // Apply coupon discount if available
    if (coupon && coupon.name !== "nil") {
        const couponDiscount = 10; // Example: Assuming 10% discount
        const totalAfterDiscount = orderAmount * (1 - couponDiscount / 100);
        orderAmount = totalAfterDiscount;
    }

    try {
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: orderAmount,
            currency: "cad",
            description,
            shipping: {
                address: {
                    line1: shipping.line1,
                    line2: shipping.line2,
                    city: shipping.city,
                    country: shipping.country,
                    postal_code: shipping.postal_code
                },
                name: shipping.name,
                phone: shipping.phone
            }
        });

        // Send PaymentIntent client secret in the response
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        // Handle any errors
        console.error("Error creating PaymentIntent:", error);
        res.status(500).send({ error: "Error creating PaymentIntent" });
    }
});

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    payWithStripe
}