const express = require("express");
const router = express.Router();
const {protect, adminOnly} = require("../middleware/authMiddleware");
const { createBrand, getBrand, deleteBrand } = require("../controllers/brandController");


router.post('/createBrand',protect,adminOnly,createBrand);
router.get("/getBrand",protect,adminOnly,getBrand);
router.get("/:slog",protect,adminOnly,deleteBrand);
module.exports = router;