# Chat Yêu Thương 💕

Ứng dụng chat cute dành cho các cặp đôi yêu nhau, với giao diện đáng yêu và tính năng realtime.

## ✨ Tính năng

- 💕 Giao diện cute với gradient pastel
- 💬 Chat realtime qua WebSocket
- 💖 Tin nhắn trái tim và ngôi sao đặc biệt
- 📱 Responsive hoàn toàn cho mobile
- 🗄️ Lưu trữ tin nhắn với MongoDB
- 🔄 Auto-reconnect khi mất kết nối
- 🎨 Hiệu ứng animation mượt mà

## 🚀 Cách chạy ứng dụng

### 1. Cài đặt dependencies

\`\`\`bash
# Cài đặt cho client (Next.js)
npm install

# Cài đặt cho server
cd server
npm install
cd ..
\`\`\`

### 2. Cấu hình MongoDB

Tạo file `server/.env` và thêm:

\`\`\`env
MONGODB_URI=mongodb+srv://hoanpham12112003_db_user:<db_password>@chatting.sjvaxvz.mongodb.net/?retryWrites=true&w=majority&appName=chatting
PORT=3001
\`\`\`

### 3. Chạy ứng dụng

\`\`\`bash
# Terminal 1: Chạy server WebSocket
npm run server:dev

# Terminal 2: Chạy client Next.js
npm run dev
\`\`\`

### 4. Truy cập ứng dụng

- Client: http://localhost:3000
- Server: ws://localhost:3001

## 🏗️ Cấu trúc dự án

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/messages/       # API routes (fallback)
│   ├── globals.css         # Global styles với theme cute
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Main page với state management
├── components/
│   ├── chat-interface.tsx  # Giao diện chat chính
│   ├── intro-screen.tsx    # Màn hình giới thiệu
│   └── ui/                # Shadcn/ui components
├── server/
│   ├── chat-server.js     # WebSocket server
│   ├── models/Message.js  # MongoDB schema
│   └── package.json       # Server dependencies
└── public/                # Static assets
\`\`\`

## 🎨 Thiết kế

- **Màu sắc**: Gradient pastel từ hồng đến xanh dương
- **Typography**: Geist Sans font family
- **Animations**: Float, pulse, bounce effects
- **Glass effect**: Backdrop blur cho modern look

## 🔧 Công nghệ sử dụng

- **Frontend**: Next.js 14, React 19, TypeScript
- **UI**: Shadcn/ui, Tailwind CSS, Lucide icons
- **Backend**: Node.js, WebSocket (ws)
- **Database**: MongoDB với Mongoose
- **Deployment**: Vercel (client), Railway/Heroku (server)

## 📱 Responsive Design

Ứng dụng được thiết kế mobile-first và hoạt động tốt trên:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🚀 Deploy

### Client (Vercel)
\`\`\`bash
npm run build
# Deploy to Vercel
\`\`\`

### Server (Railway/Heroku)
\`\`\`bash
cd server
# Deploy server to Railway hoặc Heroku
\`\`\`

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License - Sử dụng tự do cho mục đích cá nhân và thương mại.
