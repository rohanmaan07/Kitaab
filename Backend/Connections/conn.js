const mongoose = require("mongoose");
const uri = process.env.ATLAS_DB;
async function main() {
  try {
    await mongoose.connect(uri, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = main;
