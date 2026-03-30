const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", adminAuthMiddleware, createProduct);
router.put("/:id", adminAuthMiddleware, updateProduct);
router.delete("/:id", adminAuthMiddleware, deleteProduct);

module.exports = router;
