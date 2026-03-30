const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch product" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, stock } = req.body;

    const product = await Product.create({
      name,
      price,
      description,
      image,
      stock,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to create product", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        image,
        stock,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(updatedProduct);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update product", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
