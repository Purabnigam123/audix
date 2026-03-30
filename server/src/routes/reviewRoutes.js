const express = require("express");
const { createReview, getReviewsByProduct } = require("../controllers/reviewController");

const router = express.Router();

router.get("/:productId", getReviewsByProduct);
router.post("/:productId", createReview);

module.exports = router;
