require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
const database = require("./database")
const Account = require("./models/Account")

async function seedAccounts() {
  try {
    console.log("Connecting to database...")
    await database.connect()
    
    console.log("Seeding account data...")
    
    // Tạo dữ liệu mẫu cho tài khoản
    const sampleAccounts = [
      { email: "test@example.com", password: "123456" },
      { email: "user1@example.com", password: "123456" },
      { email: "user2@example.com", password: "123456" },
      { email: "user3@example.com", password: "123456" },
      { email: "admin@example.com", password: "123456" },
      { email: "demo@example.com", password: "123456" },
      { email: "love@example.com", password: "123456" },
      { email: "friend@example.com", password: "123456" },
      { email: "family@example.com", password: "123456" },
      { email: "colleague@example.com", password: "123456" }
    ]

    // Xóa dữ liệu cũ
    await Account.deleteMany({})
    console.log("Cleared existing account data")

    // Thêm dữ liệu mới
    await Account.insertMany(sampleAccounts)
    console.log(" Seeded account data successfully!")

    // Hiển thị kết quả
    const count = await Account.countDocuments()
    console.log('Total accounts in database: ')

  } catch (error) {
    console.error(" Error seeding data:", error)
  } finally {
    await database.disconnect()
    console.log("Database connection closed")
    process.exit(0)
  }
}

// Chạy seed data
seedAccounts()
