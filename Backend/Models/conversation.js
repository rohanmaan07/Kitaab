const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Types.ObjectId,
                ref: "user",
                required: true,
            },
        ],
        lastMessage: {
            type: mongoose.Types.ObjectId,
            ref: "message",
        },
        lastMessageContent: {
            type: String,
            default: "",
        },
        lastMessageTime: {
            type: Date,
            default: Date.now,
        },
        unreadCount: {
            type: Map,
            of: Number,
            default: {},
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        blockedBy: {
            type: mongoose.Types.ObjectId,
            ref: "user",
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique conversations between two users
conversationSchema.index({ participants: 1 });

// Method to get the other participant in the conversation
conversationSchema.methods.getOtherParticipant = function (userId) {
    return this.participants.find(
        (participantId) => participantId.toString() !== userId.toString()
    );
};

module.exports = mongoose.model("conversation", conversationSchema);
