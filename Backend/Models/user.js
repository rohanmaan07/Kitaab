const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    bookmarks: {
        type: Array,
        default: [],
    },
    avatar: {
        type: String,
        default:
            "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    bio: {
        type: String,
        default: "Dil se nikalti hai jo baat, asar rakhti hai",
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    favourite: [
        {
            type: mongoose.Types.ObjectId,
            ref: "book",
        },
    ],
    carts: [
        {
            type: mongoose.Types.ObjectId,
            ref: "book",
        },
    ],
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref: "order",
        },
    ],
}, { timestamps: true });

module.exports = mongoose.models.user || mongoose.model("user", UserSchema);
