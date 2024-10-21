const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const User = require("./Routes/user");
const Book = require("./Routes/book");
const Fav = require("./Routes/fav");
const Order = require("./Routes/order");
const Cart = require("./Routes/cart");
const connectDB = require("./Connections/conn"); // Ensure conn.js exports connectDB
require("dotenv").config();

const _dirname = path.resolve();

// Call the connectDB function to connect to MongoDB
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully..");

    // Start the server only after a successful connection
    app.listen(8080, () => {
      console.log("Server is listening on port 8080..");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if the connection fails
  });

app.use(express.json());

// Middleware
app.use(cors());

// Routes
app.use("/api/v1", User);
app.use("/api/v1", Book);
app.use("/api/v1", Fav);
app.use("/api/v1", Order);
app.use("/api/v1", Cart);

// Serve static files
app.use(express.static(path.join(_dirname, "/Frontend/dist")));

// Handle all other requests
app.get('*', (_, res) => {
  res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
});
