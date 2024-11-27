const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const User = require("./Routes/user");
const Book = require("./Routes/book");
const Fav = require("./Routes/fav");
const Order = require("./Routes/order");
const Cart = require("./Routes/cart");
const Tweet=require("./Routes/tweet");
// const payment = require("./Routes/payment");
const main = require("./Connections/conn");
require("dotenv").config();

const _dirname = path.resolve();

main()
    .then(() => {
        console.log("MongoDB connected successfully..");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Middleware setup
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Routes
app.use("/api/v1", User);
app.use("/api/v1", Book);
app.use("/api/v1", Fav);
app.use("/api/v1", Order);
app.use("/api/v1", Cart);
app.use("/api/v1", Tweet);
// app.use("/api/v1", payment);

// Serve static files from Frontend
const frontendPath = path.join(_dirname, "Frontend", "dist");
app.use(express.static(frontendPath));
app.get('*', (_, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Server listening

app.listen(8080, () => {
    console.log(`Server is listening on port..`);
});
