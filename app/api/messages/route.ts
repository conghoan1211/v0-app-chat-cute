import { type NextRequest, NextResponse } from "next/server";

import db from "@/server/database";
import Message from "@/server/models/Message";

// GET - Lấy tin nhắn theo chat ID với phân trang
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!chatId) {
      return NextResponse.json(
        { error: "Missing chatId parameter" },
        { status: 400 }
      );
    }

    // Kết nối database
    await db.connect();

    // Tính toán skip cho phân trang
    const skip = (page - 1) * limit;

    // Lấy tin nhắn theo chat ID với phân trang
    const messages = await Message.find({ chatId })
      .sort({ timestamp: -1 }) // Sắp xếp mới nhất trước
      .skip(skip)
      .limit(limit);

    // Đếm tổng số tin nhắn
    const totalMessages = await Message.countDocuments({ chatId });
    const totalPages = Math.ceil(totalMessages / limit);

    return NextResponse.json({
      success: true,
      messages: messages.reverse(), // Đảo ngược để hiển thị từ cũ đến mới
      pagination: {
        page,
        limit,
        totalMessages,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return NextResponse.json(
      { error: "Server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const message = await request.json();

    const { id, chatId, text, sender, timestamp, type = "text" } = message;

    if (!chatId || !text || !sender || !id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: id, chatId, text, sender",
        },
        { status: 400 }
      );
    }

    await db.connect();

    // Try insert; if duplicate id, return the existing message
    try {
      const saved = await Message.create({
        id,
        chatId,
        text,
        sender, // email
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        type,
      });
      return NextResponse.json({ success: true, message: saved });
    } catch (e: any) {
      // E11000 duplicate key error
      if (
        e &&
        (e.code === 11000 || (e.message && e.message.includes("duplicate key")))
      ) {
        const existing = await Message.findOne({ id });
        if (existing) {
          return NextResponse.json({ success: true, message: existing });
        }
      }
      throw e;
    }
  } catch (error) {
    console.error("[v0] API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process message" },
      { status: 500 }
    );
  }
}
