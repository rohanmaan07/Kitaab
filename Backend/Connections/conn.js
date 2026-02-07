const mongoose = require("mongoose");
const uri = process.env.ATLAS_DB;

async function main() {
  try {
    if (!uri) {
      throw new Error("ATLAS_DB environment variable is not defined");
    }

    await mongoose.connect(uri, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error; 
  }
}

module.exports = main;
