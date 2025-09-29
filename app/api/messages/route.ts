import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    text: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
      enum: ["me", "partner"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      default: "text",
      enum: ["text", "heart", "star"],
    },
  },
  {
    timestamps: true,
  },
)

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema)

async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || "")
    console.log("[v0] Connected to MongoDB")
  } catch (error) {
    console.error("[v0] MongoDB connection error:", error)
    throw error
  }
}

export async function GET() {
  try {
    await connectDB()

    const messages = await Message.find({}).sort({ timestamp: 1 }).limit(100).lean()

    return NextResponse.json({
      success: true,
      messages: messages.map((msg) => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp,
        type: msg.type || "text",
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const messageData = await request.json()

    if (!messageData.timestamp) {
      messageData.timestamp = new Date()
    }

    const message = new Message({
      id: messageData.id,
      text: messageData.text,
      sender: messageData.sender,
      timestamp: new Date(messageData.timestamp),
      type: messageData.type || "text",
    })

    await message.save()
    console.log("[v0] Message saved to database:", messageData.id)

    return NextResponse.json({
      success: true,
      message: "Message saved successfully",
      data: messageData,
    })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ success: false, message: "Failed to process message" }, { status: 500 })
  }
}
