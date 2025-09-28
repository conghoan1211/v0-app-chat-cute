const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "/placeholder-user.jpg",
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageTimestamp: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    participants: [{
      type: String, // email của người tham gia
      required: true,
    }],
    createdBy: {
      type: String, // email của người tạo chat
      required: true,
    },
    chatType: {
      type: String,
      enum: ["private", "group"],
      default: "private",
    },
  },
  {
    timestamps: true,
  },
)

// Index để tìm kiếm nhanh
chatSchema.index({ participants: 1 })
chatSchema.index({ createdBy: 1 })
chatSchema.index({ lastMessageTimestamp: -1 })

module.exports = mongoose.model("Chat", chatSchema)
