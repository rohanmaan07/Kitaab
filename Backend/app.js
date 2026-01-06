const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");
const User = require("./Routes/user");
const Book = require("./Routes/book");
const Fav = require("./Routes/fav");
const Order = require("./Routes/order");
const Cart = require("./Routes/cart");
const Tweet = require("./Routes/tweet");
const Bot = require("./Routes/bot");
const Notification = require("./Routes/notification");
const Payment = require("./Routes/payment");
const Message = require("./Routes/message");
const main = require("./Connections/conn");
const { initializeSocket } = require("./socket");
require("dotenv").config();

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Initialize Socket.io
initializeSocket(io);

// Make io accessible to routes
app.set("io", io);

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
app.use("/api/v1", Bot);
app.use("/api/v1", Payment);
app.use("/api/v1/notifications", Notification);
app.use("/api/v1", Message);

// Serve static files from Frontend
const frontendPath = path.join(__dirname, "..", "Frontend", "dist");
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
server.listen(8080, () => {
    console.log(`Server is listening on port 8080..`);
    console.log(`Socket.io is ready for real-time messaging`);
});
