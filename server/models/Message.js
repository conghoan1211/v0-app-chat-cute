const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    chatId: { type: String, required: true }, // ID của cuộc trò chuyện
    text: { type: String, required: true },
    // Store sender as email string for consistency across API and WS
    sender: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, default: "text", enum: ["text", "heart", "star"] },
  },
  { timestamps: true }
);

// Index để tìm kiếm nhanh
messageSchema.index({ chatId: 1, timestamp: -1 });

// Dùng mongoose.models để tránh lỗi model đã tồn tại khi reload
module.exports = mongoose.models.Message || mongoose.model("Message", messageSchema);