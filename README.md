# Chat Yêu Thương 💕

Ứng dụng chat cute dành cho các cặp đôi yêu nhau, với giao diện đáng yêu và tính năng realtime.

## ✨ Tính năng

- 💕 Giao diện cute với gradient pastel
- 💬 Chat realtime với API polling
- 💖 Tin nhắn trái tim và ngôi sao đặc biệt
- 📱 Responsive hoàn toàn cho mobile
- 🗄️ Lưu trữ tin nhắn với MongoDB
- 🎨 Hiệu ứng animation mượt mà
- 🚀 Deploy dễ dàng trên Vercel

## 🚀 Cách chạy ứng dụng

### 1. Cài đặt dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Cấu hình MongoDB

Thêm environment variable trong Vercel hoặc file `.env.local`:

\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=development
\`\`\`

### 3. Chạy ứng dụng

\`\`\`bash
# Development
npm run dev

# Production
npm run build
npm start
\`\`\`

### 4. Truy cập ứng dụng

- Development: http://localhost:3000
- Production: URL từ Vercel deployment

## 🌐 Deploy Production (Giải quyết vấn đề "cần tài khoản Vercel")

### Vấn đề: Tại sao người khác cần tài khoản Vercel để xem?

Điều này xảy ra khi ứng dụng chưa được deploy **production**. Giải pháp:

### ✅ Deploy qua Vercel Dashboard

1. Truy cập https://vercel.com và đăng nhập
2. Nhấn "New Project" → Import từ GitHub
3. Thêm Environment Variables:
   - `MONGODB_URI`: Connection string MongoDB
   - `NODE_ENV`: `production`
4. Nhấn "Deploy"

### ✅ Deploy qua CLI

\`\`\`bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy production
vercel --prod
\`\`\`

### ✅ Kết quả

Sau khi deploy thành công:
- ✅ URL công khai (VD: `https://cute-chat-app.vercel.app`)
- ✅ **Bất kỳ ai** có link đều truy cập được mà không cần tài khoản Vercel
- ✅ Ứng dụng hoạt động độc lập hoàn toàn

## 🏗️ Cấu trúc dự án

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/messages/       # API routes cho MongoDB
│   ├── globals.css         # Global styles với theme cute
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Main page với state management
├── components/
│   ├── chat-interface.tsx  # Giao diện chat chính
│   ├── intro-screen.tsx    # Màn hình giới thiệu
│   └── ui/                # Shadcn/ui components
├── server/                # Legacy server files (không dùng trong production)
├── vercel.json            # Cấu hình Vercel deployment
└── DEPLOYMENT.md          # Hướng dẫn deploy chi tiết
\`\`\`

## 🎨 Thiết kế

- **Màu sắc**: Gradient pastel từ hồng đến xanh dương
- **Typography**: Geist Sans font family
- **Animations**: Float, pulse, bounce effects
- **Glass effect**: Backdrop blur cho modern look

## 🔧 Công nghệ sử dụng

- **Frontend**: Next.js 14, React 19, TypeScript
- **UI**: Shadcn/ui, Tailwind CSS, Lucide icons
- **Backend**: Next.js API Routes
- **Database**: MongoDB với Mongoose
- **Deployment**: Vercel (full-stack)

## 📱 Responsive Design

Ứng dụng được thiết kế mobile-first và hoạt động tốt trên:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🔍 Troubleshooting

### "Cần tài khoản Vercel để xem"
- **Nguyên nhân**: Ứng dụng ở chế độ preview
- **Giải pháp**: Deploy production như hướng dẫn trên

### Lỗi Database Connection
- Kiểm tra `MONGODB_URI` đúng format
- Whitelist IP trong MongoDB Atlas
- Test connection với MongoDB Compass

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License - Sử dụng tự do cho mục đích cá nhân và thương mại.
