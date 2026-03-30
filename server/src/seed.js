const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const sampleProducts = require("./data/sampleProducts");

dotenv.config();

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    // eslint-disable-next-line no-console
    console.log("Sample products inserted");
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedProducts();
