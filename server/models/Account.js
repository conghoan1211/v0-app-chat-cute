const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Lưu ý: nên hash password ở thực tế!
    username: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    createdAt: { type: Date, default: Date.now }
});

// Dùng mongoose.models để tránh lỗi model đã tồn tại khi reload
module.exports = mongoose.models.Account || mongoose.model("Account", AccountSchema);