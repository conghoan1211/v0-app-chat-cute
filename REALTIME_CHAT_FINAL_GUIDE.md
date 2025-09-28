# Chat Yêu Thương  - Hướng dẫn sử dụng Chat Realtime

##  Cách chạy ứng dụng

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

### 3. Clear database (bỏ seed data)
`ash
# Xóa tất cả dữ liệu cũ
npm run clear:db
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

##  Tính năng Chat Realtime

### 1. Luồng hoạt động
1. **Đăng nhập**  Nhập email/password (tự động tạo account nếu chưa có)
2. **Danh sách tài khoản**  Xem tất cả user có thể chat
3. **Tạo chat**  Click vào user để tạo cuộc trò chuyện mới
4. **Giao diện chat**  Chat realtime với tin nhắn thực từ database

### 2. Tính năng chat realtime
- **Tin nhắn thực**: Load tin nhắn từ MongoDB thay vì mock data
- **Phân trang**: Tải thêm tin nhắn cũ với nút "Tải thêm tin nhắn cũ"
- **WebSocket**: Chat realtime giữa 2 account thực
- **Lưu trữ**: Tất cả tin nhắn được lưu vào database với chatId
- **Tin nhắn đặc biệt**: Gửi trái tim  và ngôi sao 

### 3. Cách test chat realtime
1. Mở 2 tab trình duyệt
2. Đăng nhập với 2 account khác nhau
3. Tạo chat giữa 2 account
4. Gửi tin nhắn từ tab này sẽ hiện ở tab kia ngay lập tức

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

### Model Message (Đã cập nhật)
`javascript
{
  id: String (unique),
  chatId: String, // ID của cuộc trò chuyện
  text: String,
  sender: String, // email của người gửi
  timestamp: Date,
  type: "text" | "heart" | "star"
}
`

##  API Endpoints

### GET /api/messages?chatId=...&page=...&limit=...
Lấy tin nhắn theo chat ID với phân trang
- chatId: ID của cuộc trò chuyện
- page: Trang (mặc định: 1)
- limit: Số tin nhắn mỗi trang (mặc định: 20)

### GET /api/accounts?search=...&currentUserEmail=...
Lấy danh sách tài khoản
- search: Tìm kiếm theo email (optional)
- currentUserEmail: Loại bỏ user hiện tại (optional)

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

##  WebSocket Protocol

### Join Chat
`javascript
{
  type: "join_chat",
  chatId: "chat_id",
  userEmail: "user@example.com"
}
`

### Send Message
`javascript
{
  type: "message",
  id: "message_id",
  text: "Nội dung tin nhắn",
  sender: "user@example.com", // email thay vì "me"
  timestamp: "2024-01-01T00:00:00.000Z",
  type: "text"
}
`

##  Tài khoản test

Bạn có thể tạo tài khoản mới bằng cách:
1. Đăng nhập với email bất kỳ (sẽ tự động tạo account)
2. Hoặc sử dụng các email có sẵn trong database

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

##  Scripts có sẵn

- 
pm run dev - Chạy client Next.js
- 
pm run server:dev - Chạy server WebSocket
- 
pm run clear:db - Xóa tất cả dữ liệu database
- 
pm run seed:accounts - Tạo tài khoản mẫu (không cần thiết)
- 
pm run seed:chats - Tạo chat mẫu (không cần thiết)

##  Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

##  License

MIT License - Sử dụng tự do cho mục đích cá nhân và thương mại.
