const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    // eslint-disable-next-line no-console
    console.error("MONGO_URI is missing in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
