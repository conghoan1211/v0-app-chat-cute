require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
const WebSocket = require("ws")
const http = require("http")
const database = require("./database")
const Message = require("./models/Message")

// Initialize database connection
database.connect().catch((error) => {
  console.error("Failed to connect to MongoDB:", error)
  process.exit(1)
})

// Create HTTP server
const server = http.createServer()

// Create WebSocket server
const wss = new WebSocket.Server({ server })

// Store connected clients with their chat info
const clients = new Map() // client -> { chatId, userEmail }

wss.on("connection", async (ws) => {
  console.log("New client connected")

  // Handle incoming messages
  ws.on("message", async (data) => {
    try {
      const messageData = JSON.parse(data)
      console.log("Received message:", messageData)

      // Handle different message types
      if (messageData.type === "join_chat") {
        const { chatId, userEmail } = messageData
        clients.set(ws, { chatId, userEmail })
        console.log(' Client joined chat:', chatId, 'as', userEmail)
        return
      }

      // Handle regular messages
      const clientInfo = clients.get(ws)
      if (!clientInfo || !clientInfo.chatId) {
        console.error("Client not joined any chat")
        return
      }

      const newMessage = new Message({
        id: messageData.id,
        chatId: clientInfo.chatId,
        text: messageData.text,
        sender: messageData.sender,
        timestamp: new Date(messageData.timestamp),
        type: messageData.type || "text",
      })

      await newMessage.save()
      console.log("Message saved to MongoDB")

      // Broadcast to clients in the same chat
      clients.forEach((clientInfo, client) => {
        if (client !== ws &&
          client.readyState === WebSocket.OPEN &&
          clientInfo.chatId === newMessage.chatId) {
          client.send(JSON.stringify({
            ...messageData,
            chatId: newMessage.chatId
          }))
        }
      })
    } catch (error) {
      console.error("Error processing message:", error)
    }
  })

  // Handle client disconnect
  ws.on("close", () => {
    console.log("Client disconnected")
    clients.delete(ws)
  })

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error)
    clients.delete(ws)
  })
})

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log('Chat server running on port')
  console.log('WebSocket server ready at ws' + PORT + '/ws')
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down server...")
  wss.close(() => {
    server.close(() => {
      database.disconnect().then(() => {
        console.log("Server closed")
        process.exit(0)
      })
    })
  })
})
