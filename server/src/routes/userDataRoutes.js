const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const {
  getUserData,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  toggleWishlist,
  updateProfile,
  getMyOrders,
  placeOrder,
  getAllOrdersForAdmin,
} = require("../controllers/userDataController");

const router = express.Router();

router.get("/admin/orders", adminAuthMiddleware, getAllOrdersForAdmin);

router.use(authMiddleware);

router.get("/me/data", getUserData);
router.patch("/me", updateProfile);
router.get("/me/orders", getMyOrders);
router.post("/me/orders", placeOrder);
router.post("/me/cart", addToCart);
router.patch("/me/cart/:productId", updateCartQuantity);
router.delete("/me/cart/:productId", removeFromCart);
router.post("/me/wishlist", toggleWishlist);

module.exports = router;
