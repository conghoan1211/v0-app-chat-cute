require("dotenv").config()
const next = require("next")
const http = require("http")
const WebSocket = require("ws")
const url = require("url")

// Local server-side modules
const database = require("./server/database")
const Message = require("./server/models/Message")
const Chat = require("./server/models/Chat")

const dev = process.env.NODE_ENV !== "production"
const port = parseInt(process.env.PORT || "3000", 10)
const pushHandler = require("./app/api/push/send/route")

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

    // WebSocket server on same HTTP server/port
    const wss = new WebSocket.Server({ server })

    // Store connected clients: Map<WebSocket, { chatId, userEmail }>
    const clients = new Map()

    wss.on("connection", (ws) => {
        console.log("[ws] New client connected")

        ws.on("message", async (data) => {
            try {
                const messageData = JSON.parse(data)

                if (messageData.type === "join_chat") {
                    const { chatId, userEmail } = messageData
                    clients.set(ws, { chatId, userEmail })
                    console.log("[ws] Client joined chat:", chatId, "as", userEmail)
                    return
                }

                const clientInfo = clients.get(ws)
                if (!clientInfo || !clientInfo.chatId) {
                    console.error("[ws] Client not joined any chat")
                    return
                }

                // Persist message
                const newMessage = new Message({
                    id: messageData.id,
                    chatId: clientInfo.chatId,
                    text: messageData.text,
                    sender: messageData.sender,
                    timestamp: new Date(messageData.timestamp),
                    type: messageData.type || "text",
                })

                await newMessage.save()
                console.log("[ws] Message saved")

                // Broadcast to other clients in same chat
                clients.forEach((info, client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN && info.chatId === newMessage.chatId) {
                        client.send(
                            JSON.stringify({
                                ...messageData,
                                chatId: newMessage.chatId,
                            }),
                        )
                    }
                })

                // Push notifications to recipients (exclude sender)
                try {
                    const chat = await Chat.findOne({ id: newMessage.chatId })
                    if (chat && chat.participants) {
                        const recipients = chat.participants.filter((email) => email !== messageData.sender)
                        const payload = JSON.stringify({
                            title: `Tin nhắn mới từ ${messageData.sender}`,
                            body: messageData.text && messageData.text.length > 50 ? messageData.text.substring(0, 50) + "..." : messageData.text,
                            data: {
                                chatId: newMessage.chatId,
                                sender: messageData.sender,
                                messageId: newMessage.id,
                            },
                        })

                        recipients.forEach(async (recipientEmail) => {
                            // Call Next API to send push using web-push (keeps logic in one place)
                            const req = http.request(
                                {
                                    hostname: "localhost",
                                    port,
                                    path: "/api/push/send",
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                },
                                (res) => {
                                    console.log(`[push] ${recipientEmail} -> ${res.statusCode}`)
                                },
                            )
                            req.on("error", (e) => console.error("[push] error", e.message))
                            req.write(JSON.stringify({ userEmail: recipientEmail, ...JSON.parse(payload) }))
                            req.end()
                        })
                    }
                } catch (err) {
                    console.error("[ws] Push notify error:", err)
                }
            } catch (err) {
                console.error("[ws] Error processing message:", err)
            }
        })

        ws.on("close", () => {
            clients.delete(ws)
            console.log("[ws] Client disconnected")
        })

        ws.on("error", (err) => {
            clients.delete(ws)
            console.error("[ws] Error:", err)
        })
    })

    server.listen(port, () => {
        console.log(`➡️  Server ready on http://localhost:${port}`)
        console.log(`➡️  WebSocket ready on ws://localhost:${port}`)
    })
}

start().catch((e) => {
    console.error("Fatal start error:", e)
    process.exit(1)
})
