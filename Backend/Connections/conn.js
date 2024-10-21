const mongoose = require("mongoose");

const uri = process.env.ATLAS_DB;

async function main() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000, // Optional: Increase timeout for debugging
      socketTimeoutMS: 45000,  // Optional: Increase socket timeout for long queries
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = main;
