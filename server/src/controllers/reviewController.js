const Product = require("../models/Product");
const Review = require("../models/Review");

const SAMPLE_REVIEW_TEMPLATES = [
  {
    username: "Rohan S.",
    comment: "Great sound clarity and comfort for long sessions.",
    rating: 5,
  },
  {
    username: "Meera K.",
    comment: "Build quality is solid and bass feels balanced.",
    rating: 4,
  },
  {
    username: "Arjun P.",
    comment: "Value for money product with clean audio output.",
    rating: 4,
  },
];

const seedSampleReviewsIfNeeded = async (productId) => {
  const existingCount = await Review.countDocuments({ productId });
  if (existingCount > 0) {
    return;
  }

  const sampleReviews = SAMPLE_REVIEW_TEMPLATES.map((review) => ({
    ...review,
    productId,
  }));

  await Review.insertMany(sampleReviews);
};

const getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    await seedSampleReviewsIfNeeded(productId);

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

const createReview = async (req, res) => {
  try {
    const { username, comment, rating } = req.body;
    const productId = req.params.productId;

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = await Review.create({
      productId,
      username,
      comment,
      rating,
    });

    return res.status(201).json(review);
  } catch (error) {
    return res.status(400).json({ message: "Failed to add review", error: error.message });
  }
};

module.exports = {
  getReviewsByProduct,
  createReview,
};
