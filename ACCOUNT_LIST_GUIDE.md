# Chat Yêu Thương  - Hướng dẫn sử dụng mới

##  Cách chạy ứng dụng với Database

### 1. Cài đặt dependencies
`ash
# Cài đặt cho client (Next.js)
npm install

# Cài đặt cho server
cd server
npm install
cd ..
`

### 2. Cấu hình MongoDB
Tạo file .env trong thư mục gốc và thêm:
`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app?retryWrites=true&w=majority
PORT=3001
`

### 3. Seed dữ liệu mẫu
`ash
# Seed tài khoản mẫu
npm run seed:accounts

# Seed chat mẫu (nếu cần)
npm run seed:chats

# Hoặc seed tất cả
npm run seed:all
`

### 4. Chạy ứng dụng
`ash
# Terminal 1: Chạy server WebSocket
npm run server:dev

# Terminal 2: Chạy client Next.js
npm run dev
`

### 5. Truy cập ứng dụng
- Client: http://localhost:3000
- Server: ws://localhost:3001

##  Tính năng mới - Danh sách tài khoản

### 1. Màn hình danh sách tài khoản
- Hiển thị tất cả tài khoản trong hệ thống (trừ tài khoản hiện tại)
- Tìm kiếm tài khoản theo email
- Click vào tài khoản để tạo chat mới

### 2. Luồng hoạt động
1. **Đăng nhập**  Nhập email/password
2. **Danh sách tài khoản**  Xem tất cả user có thể chat
3. **Tạo chat**  Click vào user để bắt đầu trò chuyện
4. **Giao diện chat**  Chat realtime

### 3. Tính năng tìm kiếm
- Tìm kiếm realtime theo email
- Debounced search (300ms)
- Hiển thị số lượng tài khoản tìm thấy

##  Cấu trúc Database

### Model Account
`javascript
{
  email: String (unique),
  password: String
}
`

### Model Chat
`javascript
{
  id: String (unique),
  name: String,
  avatar: String,
  lastMessage: String,
  lastMessageTimestamp: Date,
  unreadCount: Number,
  isOnline: Boolean,
  isPinned: Boolean,
  participants: [String], // emails
  createdBy: String, // email
  chatType: "private" | "group"
}
`

### Model Message
`javascript
{
  id: String (unique),
  text: String,
  sender: "me" | "partner",
  timestamp: Date,
  type: "text" | "heart" | "star"
}
`

##  API Endpoints

### GET /api/accounts?search=...&currentUserEmail=...
Lấy danh sách tài khoản
- search: Tìm kiếm theo email (optional)
- currentUserEmail: Loại bỏ user hiện tại (optional)

### GET /api/chats?userEmail=...
Lấy danh sách chat của user

### POST /api/chats
Tạo chat mới
`json
{
  "name": "Tên chat",
  "avatar": "/path/to/avatar.jpg",
  "participants": ["user1@example.com", "user2@example.com"],
  "createdBy": "user@example.com",
  "chatType": "private"
}
`

### POST /api/auth
Đăng nhập/đăng ký
`json
{
  "email": "user@example.com",
  "password": "123456"
}
`

##  Tài khoản mẫu

Sau khi chạy 
pm run seed:accounts, bạn có thể đăng nhập bằng:

- 	est@example.com / 123456
- user1@example.com / 123456
- user2@example.com / 123456
- user3@example.com / 123456
- dmin@example.com / 123456
- demo@example.com / 123456
- love@example.com / 123456
- riend@example.com / 123456
- amily@example.com / 123456
- colleague@example.com / 123456

##  Deploy

### Client (Vercel)
`ash
npm run build
# Deploy to Vercel
`

### Server (Railway/Heroku)
`ash
cd server
# Deploy server to Railway hoặc Heroku
`

##  Responsive Design

Ứng dụng được thiết kế mobile-first và hoạt động tốt trên:
-  Mobile (320px+)
-  Tablet (768px+)
-  Desktop (1024px+)

##  Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

##  License

MIT License - Sử dụng tự do cho mục đích cá nhân và thương mại.
