"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Send, Smile, Star, ArrowLeft } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "me" | "partner"
  timestamp: Date
  type?: "text" | "heart" | "star"
}

interface ChatInterfaceProps {
  onBack: () => void
}

export default function ChatInterface({ onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws"
        const wsUrl = `${wsProtocol}://${window.location.host}`
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
          console.log("[v0] Connected to chat server")
          setSocket(ws)
          setIsConnected(true)
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            const newMessage: Message = {
              id: data.id,
              text: data.text,
              sender: data.sender,
              timestamp: new Date(data.timestamp),
              type: data.type || "text",
            }
            setMessages((prev) => {
              const exists = prev.some((msg) => msg.id === newMessage.id)
              if (exists) return prev
              return [...prev, newMessage]
            })
          } catch (error) {
            console.error("[v0] Error parsing message:", error)
          }
        }

        ws.onclose = () => {
          console.log("[v0] Disconnected from chat server")
          setSocket(null)
          setIsConnected(false)
          setTimeout(connectWebSocket, 3000)
        }

        ws.onerror = (error) => {
          console.error("[v0] WebSocket error:", error)
          setIsConnected(false)
        }

        return ws
      } catch (error) {
        console.error("[v0] Failed to connect to WebSocket:", error)
        setIsConnected(false)
        setTimeout(connectWebSocket, 5000)
        return null
      }
    }

    const ws = connectWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "me",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(
          JSON.stringify({
            type: "message",
            ...message,
          }),
        )
      } catch (error) {
        console.error("[v0] Error sending via WebSocket:", error)
        // Fallback to API
        await sendViaAPI(message)
      }
    } else {
      // Fallback to API when WebSocket is not available
      await sendViaAPI(message)
    }

    if (!isConnected) {
      simulatePartnerResponse()
    }
  }

  const sendViaAPI = async (message: Message) => {
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      })
    } catch (error) {
      console.error("[v0] Error sending via API:", error)
    }
  }

  const simulatePartnerResponse = () => {
    setIsTyping(true)
    setTimeout(
      () => {
        setIsTyping(false)
        const responses = [
          "Em cũng nhớ anh! 💕",
          "Yêu em nhiều lắm! ❤️",
          "Em là tất cả của anh! 🌟",
          "Anh luôn ở đây với em! 💖",
          "Em đẹp quá! 😍",
          "Anh yêu em vô cùng! 💝",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        const partnerMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: "partner",
          timestamp: new Date(),
          type: "text",
        }

        setMessages((prev) => [...prev, partnerMessage])
      },
      1500 + Math.random() * 2000,
    )
  }

  const sendSpecialMessage = (type: "heart" | "star") => {
    const specialMessages = {
      heart: "💖",
      star: "⭐",
    }

    const message: Message = {
      id: Date.now().toString(),
      text: specialMessages[type],
      sender: "me",
      timestamp: new Date(),
      type,
    }

    setMessages((prev) => [...prev, message])

    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(
          JSON.stringify({
            type: "message",
            ...message,
          }),
        )
      } catch (error) {
        console.error("[v0] Error sending special message:", error)
      }
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      {/* Header */}
      <Card className="glass-effect rounded-b-3xl p-4 mb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-primary/10 rounded-full">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Button>
          <Avatar className="w-12 h-12 ring-2 ring-primary/30">
            <AvatarImage src="/cute-anime-girl-avatar.png" />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">💕</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-semibold text-lg text-primary">Người yêu của em</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full pulse-soft ${isConnected ? "bg-green-400" : "bg-gray-400"}`}></div>
              {isConnected ? "Đang online" : "Offline"}
            </p>
          </div>
          <Heart className="w-6 h-6 text-red-400 float-animation" />
        </div>
      </Card>

      {/* Messages */}
      <div className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400" />
            <p>Bắt đầu cuộc trò chuyện đầu tiên nào! 💕</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${message.sender === "me" ? "order-2" : "order-1"}`}>
              <Card
                className={`message-bubble p-3 ${
                  message.sender === "me"
                    ? "bg-primary/80 text-primary-foreground ml-2"
                    : "bg-card/80 text-card-foreground mr-2"
                } ${message.type === "heart" ? "text-2xl text-center" : ""} ${
                  message.type === "star" ? "text-2xl text-center" : ""
                }`}
              >
                <p className={`${message.type !== "text" ? "text-2xl" : ""}`}>{message.text}</p>
              </Card>
              <p
                className={`text-xs text-muted-foreground mt-1 ${
                  message.sender === "me" ? "text-right mr-2" : "text-left ml-2"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
            {message.sender !== "me" && (
              <Avatar className="w-8 h-8 order-1">
                <AvatarImage src="/cute-anime-girl-small-avatar.jpg" />
                <AvatarFallback className="bg-primary/20 text-xs">💕</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/cute-anime-girl-small-avatar.jpg" />
              <AvatarFallback className="bg-primary/20 text-xs">💕</AvatarFallback>
            </Avatar>
            <Card className="message-bubble bg-card/80 text-card-foreground p-3 ml-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <Card className="glass-effect rounded-t-3xl p-4 sticky bottom-0">
        <div className="flex gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendSpecialMessage("heart")}
            className="bg-red-100/50 hover:bg-red-200/50 text-red-600 border-red-200"
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendSpecialMessage("star")}
            className="bg-yellow-100/50 hover:bg-yellow-200/50 text-yellow-600 border-yellow-200"
          >
            <Star className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-100/50 hover:bg-blue-200/50 text-blue-600 border-blue-200"
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhắn tin cho người yêu..."
            className="flex-1 bg-input/70 border-border/50 rounded-full px-4"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
