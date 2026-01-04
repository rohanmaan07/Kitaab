const express = require("express");
const { authenticateToken } = require("./userAuth");

const router = express.Router();

// Models
const Notification = require("../Models/notification");
const User = require("../Models/user");

// Get all notifications for a user
router.get("/all", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        
        const notifications = await Notification.find({ recipient: id })
            .populate("sender", "username avatar")
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            notifications,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Get unread notification count
router.get("/unread-count", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        
        const count = await Notification.countDocuments({
            recipient: id,
            read: false,
        });

        return res.status(200).json({
            count,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Mark notification as read
router.put("/read/:id", authenticateToken, async (req, res) => {
    try {
        const notificationId = req.params.id;
        
        await Notification.findByIdAndUpdate(notificationId, {
            read: true,
        });

        return res.status(200).json({
            message: "Notification marked as read",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Mark all notifications as read
router.put("/read-all", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        
        await Notification.updateMany(
            { recipient: id, read: false },
            { read: true }
        );

        return res.status(200).json({
            message: "All notifications marked as read",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Delete notification
router.delete("/delete/:id", authenticateToken, async (req, res) => {
    try {
        const notificationId = req.params.id;
        
        await Notification.findByIdAndDelete(notificationId);

        return res.status(200).json({
            message: "Notification deleted",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Create notification (helper for other routes)
async function createNotification(recipientId, senderId, type, message, tweetId = null) {
    try {
        // Don't send notification to self
        if (recipientId === senderId) return;

        await Notification.create({
            recipient: recipientId,
            sender: senderId,
            type,
            message,
            tweetId,
        });
    } catch (error) {
        console.log("Error creating notification:", error);
    }
}

module.exports = router;
module.exports.createNotification = createNotification;
