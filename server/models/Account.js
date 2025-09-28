const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Lưu ý: nên hash password ở thực tế!
    username: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Index to enforce uniqueness on username and email
AccountSchema.index({ email: 1 }, { unique: true })

// Dùng mongoose.models để tránh lỗi model đã tồn tại khi reload
module.exports = mongoose.models.Account || mongoose.model("Account", AccountSchema);