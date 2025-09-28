require("dotenv").config()
const WebSocket = require("ws")
const http = require("http")
const mongoose = require("mongoose")
const Message = require("./models/Message")

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!")
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

// Create HTTP server
const server = http.createServer()

// Create WebSocket server
const wss = new WebSocket.Server({ server })

// Store connected clients
const clients = new Set()

wss.on("connection", async (ws) => {
  console.log("New client connected")
  clients.add(ws)

  try {
    const existingMessages = await Message.find().sort({ timestamp: 1 }).limit(50)
    existingMessages.forEach((message) => {
      ws.send(
        JSON.stringify({
          id: message.id,
          text: message.text,
          sender: message.sender,
          timestamp: message.timestamp.toISOString(),
          type: message.type,
        }),
      )
    })
  } catch (error) {
    console.error("Error loading messages:", error)
  }

  // Handle incoming messages
  ws.on("message", async (data) => {
    try {
      const messageData = JSON.parse(data)
      console.log("Received message:", messageData)

      const newMessage = new Message({
        id: messageData.id,
        text: messageData.text,
        sender: messageData.sender,
        timestamp: new Date(messageData.timestamp),
        type: messageData.type || "text",
      })

      await newMessage.save()
      console.log("Message saved to MongoDB")

      // Broadcast to all connected clients except sender
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messageData))
        }
      })

      // Auto-reply simulation for demo
      if (messageData.sender === "me") {
        setTimeout(
          async () => {
            const autoReplies = [
              "Em cũng nhớ anh! 💕",
              "Yêu em nhiều lắm! ❤️",
              "Em là tất cả của anh! 🌟",
              "Anh luôn ở đây với em! 💖",
              "Em đẹp quá! 😍",
              "Anh yêu em vô cùng! 💝",
            ]

            const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)]

            const autoMessage = {
              id: Date.now().toString(),
              text: randomReply,
              sender: "partner",
              timestamp: new Date().toISOString(),
              type: "text",
            }

            try {
              const autoReplyMessage = new Message({
                id: autoMessage.id,
                text: autoMessage.text,
                sender: autoMessage.sender,
                timestamp: new Date(autoMessage.timestamp),
                type: autoMessage.type,
              })

              await autoReplyMessage.save()
              console.log("Auto-reply saved to MongoDB")

              // Send auto-reply to all clients
              clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify(autoMessage))
                }
              })
            } catch (error) {
              console.error("Error saving auto-reply:", error)
            }
          },
          1000 + Math.random() * 2000,
        )
      }
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
  console.log(`Chat server running on port ${PORT}`)
  console.log(`WebSocket server ready at ws://localhost:${PORT}`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down server...")
  wss.close(() => {
    server.close(() => {
      mongoose.connection.close(() => {
        console.log("MongoDB connection closed")
        console.log("Server closed")
        process.exit(0)
      })
    })
  })
})
