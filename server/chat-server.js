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

      // Send push notification to other participants (not the sender)
      try {
        const http = require('http')

        // Get all participants in the chat to send notifications to everyone except sender
        const Chat = require('./models/Chat')
        const chat = await Chat.findOne({ id: newMessage.chatId })

        if (chat && chat.participants) {
          // Send notification to all participants except the sender
          const recipients = chat.participants.filter(email => email !== messageData.sender)

          for (const recipientEmail of recipients) {
            const pushData = {
              userEmail: recipientEmail, // Send to recipients, not sender
              title: `Tin nhắn mới từ ${messageData.sender}`,
              body: messageData.text.length > 50 ? messageData.text.substring(0, 50) + '...' : messageData.text,
              data: {
                chatId: newMessage.chatId,
                sender: messageData.sender,
                messageId: newMessage.id
              }
            }

            const postData = JSON.stringify(pushData)
            const options = {
              hostname: 'localhost',
              port: 3000,
              path: '/api/push/send',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
              }
            }

            const req = http.request(options, (res) => {
              console.log(`Push notification sent to ${recipientEmail}: ${res.statusCode}`)
            })

            req.on('error', (e) => {
              console.error(`Push notification error for ${recipientEmail}: ${e.message}`)
            })

            req.write(postData)
            req.end()
          }
        }
      } catch (error) {
        console.error('Error sending push notification:', error)
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
