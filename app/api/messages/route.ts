import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // This endpoint can be used to fetch messages if needed
    // For now, messages are loaded via WebSocket
    return NextResponse.json({
      success: true,
      message: "Messages are loaded via WebSocket connection",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const message = await request.json()

    if (!message.timestamp) {
      message.timestamp = new Date().toISOString()
    }

    console.log("[v0] API fallback - Message received:", message)

    return NextResponse.json({
      success: true,
      message: "Message received (fallback mode - use WebSocket for real-time)",
      data: message,
    })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ success: false, message: "Failed to process message" }, { status: 500 })
  }
}
