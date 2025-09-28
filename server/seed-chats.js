require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
const database = require("./database")
const Chat = require("./models/Chat")

async function seedData() {
  try {
    console.log("Connecting to database...")
    await database.connect()
    
    console.log("Seeding chat data...")
    
    // Tạo dữ liệu mẫu cho chat
    const sampleChats = [
      {
        id: "1",
        name: "Người yêu của em ",
        avatar: "/cute-anime-girl-avatar.png",
        lastMessage: "Em cũng nhớ anh! ",
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 5),
        unreadCount: 2,
        isOnline: true,
        isPinned: true,
        participants: ["test@example.com"],
        createdBy: "test@example.com",
        chatType: "private"
      },
      {
        id: "2",
        name: "Bạn thân nhất",
        avatar: "/placeholder-user.jpg",
        lastMessage: "Hôm nay đi chơi không?",
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 30),
        unreadCount: 0,
        isOnline: false,
        isPinned: false,
        participants: ["test@example.com"],
        createdBy: "test@example.com",
        chatType: "private"
      },
      {
        id: "3",
        name: "Gia đình",
        avatar: "/placeholder.jpg",
        lastMessage: "Mẹ nhớ con quá!",
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        unreadCount: 1,
        isOnline: false,
        isPinned: true,
        participants: ["test@example.com"],
        createdBy: "test@example.com",
        chatType: "group"
      },
      {
        id: "4",
        name: "Nhóm bạn học",
        avatar: "/placeholder.svg",
        lastMessage: "Ai làm bài tập chưa?",
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        unreadCount: 5,
        isOnline: false,
        isPinned: false,
        participants: ["test@example.com"],
        createdBy: "test@example.com",
        chatType: "group"
      }
    ]

    // Xóa dữ liệu cũ
    await Chat.deleteMany({})
    console.log("Cleared existing chat data")

    // Thêm dữ liệu mới
    await Chat.insertMany(sampleChats)
    console.log(" Seeded chat data successfully!")

    // Hiển thị kết quả
    const count = await Chat.countDocuments()
    console.log('Total chats in database: ' + count)

  } catch (error) {
    console.error(" Error seeding data:", error)
  } finally {
    await database.disconnect()
    console.log("Database connection closed")
    process.exit(0)
  }
}

// Chạy seed data
seedData()
