const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["like", "follow", "reply", "mention"],
    },
    tweetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tweet",
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.models.notification || mongoose.model("notification", notificationSchema);
