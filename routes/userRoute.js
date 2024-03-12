const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logOut,getUser, getLoginStatus, updateUser, updatePhoto, saveCart, getCart } = require("../controllers/userController");
const {protect} = require("../middleware/authMiddleware")

// Define route handlers
router.post("/register", registerUser); // Assuming user registration is handled at the root path ("/")
router.post("/login",loginUser)
router.get("/logout",logOut)
router.get("/getUser",protect,getUser);
router.get("/getLoginStatus",getLoginStatus);
router.patch("/updateUser",protect,updateUser)
router.patch("/updatePhoto",protect,updatePhoto)


//cart

router.patch("/saveCart",protect,saveCart);
router.get("/getCart",protect,getCart);
module.exports = router;

