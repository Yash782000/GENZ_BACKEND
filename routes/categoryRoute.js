const express = require("express");
const router = express.Router();

const { createCategory, getCategory, deleteCategory } = require("../controllers/categoryController");
const {protect, adminOnly} = require("../middleware/authMiddleware");


router.post("/createCategory",protect,adminOnly,createCategory);
router.get("/getCategory",protect,adminOnly,getCategory);
router.get("/:slog",protect,adminOnly,deleteCategory);
module.exports = router;