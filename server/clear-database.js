// require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
// const database = require("./database")
// const Message = require("./models/Message")
// const Chat = require("./models/Chat")
// const Account = require("./models/Account")

// async function clearDatabase() {
//   try {
//     console.log("Connecting to database...")
//     await database.connect()
    
//     console.log("Clearing all data...")
    
//     // Xóa tất cả dữ liệu
//     await Message.deleteMany({})
//     await Chat.deleteMany({})
//     await Account.deleteMany({})
    
//     console.log(" Database cleared successfully!")

//   } catch (error) {
//     console.error(" Error clearing database:", error)
//   } finally {
//     await database.disconnect()
//     console.log("Database connection closed")
//     process.exit(0)
//   }
// }

// // Chạy clear database
// clearDatabase()
