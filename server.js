require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddleware")
const PORT = process.env.PORT || 8000;

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true  // if you're using cookies or authorization headers
}));

// Routes
app.use("/api/users/v1", userRoute); // Mount userRoute at /api/register
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
