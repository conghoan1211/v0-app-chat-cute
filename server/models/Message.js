const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    text: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
      enum: ["me", "partner"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      default: "text",
      enum: ["text", "heart", "star"],
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Message", messageSchema)
