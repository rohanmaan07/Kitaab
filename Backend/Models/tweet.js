const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    like: {
        type: Array,
        default: [],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", 
    },
    userDetails: {
        type: Array,
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.models.tweet || mongoose.model("tweet", tweetSchema);
