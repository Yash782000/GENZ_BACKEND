const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getOrder, updateOrderStatus, payWithStripe } = require("../controllers/orderController");
const {protect, adminOnly} = require("../middleware/authMiddleware")

router.post("/",protect,createOrder);
router.get("/",protect,getOrders);
router.patch("/:id",protect,adminOnly,updateOrderStatus);
router.get("/:id",protect,getOrder);
router.post("/create-payment-intent",payWithStripe);
module.exports = router;