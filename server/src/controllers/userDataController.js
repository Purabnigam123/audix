const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const shapeUserData = (user) => ({
  wishlistItems: user.wishlist,
  cartItems: user.cart
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product,
      quantity: item.quantity,
    })),
});

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  address: user.address,
  phone: user.phone,
  pincode: user.pincode,
});

const loadUserWithProducts = async (userId) =>
  User.findById(userId)
    .populate("wishlist")
    .populate("cart.product");

const formatOrder = (order) => ({
  id: order._id,
  status: order.status,
  totalAmount: order.totalAmount,
  createdAt: order.createdAt,
  paymentMode: order.paymentMode,
  shippingAddress: order.shippingAddress,
  phone: order.phone,
  user: order.user
    ? {
        id: order.user._id,
        name: order.user.name,
        phone: order.user.phone,
        address: order.user.address,
      }
    : null,
  items: order.items
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    })),
});

const getUserData = async (req, res) => {
  try {
    const user = await loadUserWithProducts(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(shapeUserData(user));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user data" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < 1) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = user.cart.find((item) => item.product.toString() === productId);

    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity += 1;
      }
    } else {
      user.cart.push({ product: product._id, quantity: 1 });
    }

    await user.save();

    const populated = await loadUserWithProducts(req.userId);
    return res.json(shapeUserData(populated));
  } catch (error) {
    return res.status(500).json({ message: "Failed to update cart" });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = user.cart.find((item) => item.product.toString() === productId);
    if (!existing) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const safeQuantity = Math.max(0, Math.min(Number(quantity) || 0, product.stock));

    if (safeQuantity === 0) {
      user.cart = user.cart.filter((item) => item.product.toString() !== productId);
    } else {
      existing.quantity = safeQuantity;
    }

    await user.save();

    const populated = await loadUserWithProducts(req.userId);
    return res.json(shapeUserData(populated));
  } catch (error) {
    return res.status(500).json({ message: "Failed to update cart quantity" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter((item) => item.product.toString() !== productId);
    await user.save();

    const populated = await loadUserWithProducts(req.userId);
    return res.json(shapeUserData(populated));
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = user.wishlist.some((id) => id.toString() === productId);

    if (exists) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.push(product._id);
    }

    await user.save();

    const populated = await loadUserWithProducts(req.userId);
    return res.json(shapeUserData(populated));
  } catch (error) {
    return res.status(500).json({ message: "Failed to update wishlist" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, address, phone, pincode } = req.body;

    if (!name || !address || !phone || !pincode) {
      return res.status(400).json({ message: "All profile fields are required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (phone !== user.phone) {
      const existing = await User.findOne({ phone });
      if (existing) {
        return res.status(400).json({ message: "Phone number already registered" });
      }
    }

    user.name = name;
    user.address = address;
    user.phone = phone;
    user.pincode = pincode;

    await user.save();

    return res.json({ user: toSafeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(formatOrder);

    return res.json({ orders: formattedOrders });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { paymentMode } = req.body;
    const allowedModes = ["Cash on Delivery", "UPI", "Card"];

    if (!allowedModes.includes(paymentMode)) {
      return res.status(400).json({ message: "Valid payment mode is required" });
    }

    const user = await User.findById(req.userId).populate("cart.product");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = user.cart.filter((item) => item.product);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `${item.product.name} has only ${item.product.stock} items left in stock`,
        });
      }
    }

    let totalAmount = 0;
    const orderItems = cartItems.map((item) => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    for (const item of cartItems) {
      item.product.stock = Math.max(0, item.product.stock - item.quantity);
      await item.product.save();
    }

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: user.address,
      phone: user.phone,
      paymentMode,
      status: "Placed",
    });

    user.cart = [];
    await user.save();

    const populatedOrder = await Order.findById(order._id).populate("items.product");

    return res.status(201).json({
      message: "Order placed successfully",
      order: formatOrder(populatedOrder),
      cartItems: [],
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to place order" });
  }
};

const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name phone address")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.json({ orders: orders.map(formatOrder) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch admin orders" });
  }
};

module.exports = {
  getUserData,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  toggleWishlist,
  updateProfile,
  getMyOrders,
  placeOrder,
  getAllOrdersForAdmin,
};
