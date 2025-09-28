# Cute Chat Server

Server Node.js realtime cho ứng dụng chat cute với MongoDB integration.

## Cài đặt và chạy

1. Cài đặt dependencies:
\`\`\`bash
cd server
npm install
\`\`\`

2. Cấu hình environment variables:
Tạo file `.env` và thêm:
\`\`\`env
MONGODB_URI=mongodb+srv://hoanpham12112003_db_user:<db_password>@chatting.sjvaxvz.mongodb.net/cute-chat?retryWrites=true&w=majority&appName=chatting
PORT=3001
\`\`\`

3. Chạy server:
\`\`\`bash
npm start
\`\`\`

Server sẽ chạy trên port 3001 và WebSocket sẽ có sẵn tại `ws://localhost:3001`.

## Tính năng

- WebSocket realtime messaging
- MongoDB integration để lưu tin nhắn vĩnh viễn
- Tự động tải 50 tin nhắn gần nhất khi client kết nối
- Auto-reply simulation với tin nhắn ngọt ngào
- Hỗ trợ nhiều client kết nối đồng thời
- Graceful shutdown với đóng kết nối MongoDB

## Database Schema

Tin nhắn được lưu trong MongoDB với schema:

\`\`\`javascript
{
  id: String (unique),
  text: String,
  sender: "me" | "partner",
  timestamp: Date,
  type: "text" | "heart" | "star"
}
\`\`\`

## API

Server sử dụng WebSocket protocol để giao tiếp realtime. Tin nhắn được gửi dưới dạng JSON:

\`\`\`json
{
  "id": "timestamp",
  "text": "Nội dung tin nhắn",
  "sender": "me" | "partner", 
  "timestamp": "ISO string",
  "type": "text" | "heart" | "star"
}
\`\`\`

## Lưu ý

- Thay `<db_password>` trong MONGODB_URI bằng mật khẩu thật của database
- Server tự động tạo collection "messages" trong database "cute-chat"
- Tất cả tin nhắn (bao gồm auto-reply) đều được lưu vào MongoDB
