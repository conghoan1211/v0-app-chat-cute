require("dotenv").config()
const next = require("next")
const http = require("http")
const { Server: IOServer } = require("socket.io")
const url = require("url")

// Local server-side modules
const database = require("./server/database")
const Message = require("./server/models/Message")
const Chat = require("./server/models/Chat")

const dev = process.env.NODE_ENV !== "production"
const port = parseInt(process.env.PORT || "3000", 10)

async function start() {
    // Connect DB once
    await database.connect()

    const app = next({ dev })
    const handle = app.getRequestHandler()

    await app.prepare()

    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true)
        handle(req, res, parsedUrl)
    })
    // Tune timeouts for proxies (Render/ELB best practices)
    server.keepAliveTimeout = 61_000
    server.headersTimeout = 65_000

    // Socket.IO server on same HTTP server/port
    const io = new IOServer(server, {
        cors: { origin: true, credentials: true },
        transports: ["websocket", "polling"],
    })

    io.on("connection", (socket) => {
        console.log("[io] connected", socket.id)

        socket.on("join_chat", ({ chatId, userEmail }) => {
            socket.data.chatId = chatId
            socket.data.userEmail = userEmail
            socket.join(chatId)
            console.log("[io] join_chat", chatId, userEmail)
        })

        socket.on("message", async (messageData) => {
            try {
                const chatId = socket.data.chatId
                if (!chatId) return

                const newMessage = new Message({
                    id: messageData.id,
                    chatId,
                    text: messageData.text,
                    sender: messageData.sender,
                    timestamp: new Date(messageData.timestamp),
                    type: messageData.type || "text",
                })

                await newMessage.save()
                io.to(chatId).emit("message", { ...messageData, chatId })

                try {
                    const chat = await Chat.findOne({ id: chatId })
                    if (chat && chat.participants) {
                        const recipients = chat.participants.filter((email) => email !== messageData.sender)
                        const payload = JSON.stringify({
                            title: `Tin nhắn mới từ ${messageData.sender}`,
                            body: messageData.text && messageData.text.length > 50 ? messageData.text.substring(0, 50) + "..." : messageData.text,
                            data: { chatId, sender: messageData.sender, messageId: newMessage.id },
                        })

                        const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`
                        const isHttps = baseUrl.startsWith("https://")
                        const { request } = isHttps ? require("https") : require("http")
                        const { hostname, port: urlPort } = new URL(baseUrl)
                        for (const recipientEmail of recipients) {
                            const req = request(
                                { hostname, port: urlPort || (isHttps ? 443 : 80), path: "/api/push/send", method: "POST", headers: { "Content-Type": "application/json" } },
                                (res) => console.log(`[push] ${recipientEmail} -> ${res.statusCode}`),
                            )
                            req.on("error", (e) => console.error("[push] error", e.message))
                            req.write(JSON.stringify({ userEmail: recipientEmail, ...JSON.parse(payload) }))
                            req.end()
                        }
                    }
                } catch (err) {
                    console.error("[io] push notify error:", err)
                }
            } catch (err) {
                console.error("[io] message error:", err)
            }
        })

        socket.on("disconnect", () => {
            console.log("[io] disconnected", socket.id)
        })
    })

    server.listen(port, () => {
        console.log(`➡️  Server ready on http://localhost:${port}`)
        console.log(`➡️  Socket.IO ready on ws://localhost:${port}`)
    })
}

start().catch((e) => {
    console.error("Fatal start error:", e)
    process.exit(1)
})


