require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddleware")
const PORT = process.env.PORT || 8000;
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const brandRoute = require("./routes/brandRoute");
const couponRoute = require("./routes/couponRoute");
const orderRoute = require("./routes/orderRoute");
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true  // if you're using cookies or authorization headers
}));

// Routes
app.use("/api/users/v1", userRoute); // Mount userRoute at /api/register
app.use("/api/products",productRoute);  //Mount productRoute ;
app.use("/api/category",categoryRoute);
app.use("/api/brand",brandRoute);
app.use("/api/coupon",couponRoute);
app.use("/api/order",orderRoute);
//using errorhandler 
app.use(errorHandler)
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});
