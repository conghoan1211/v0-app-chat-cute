import { NextRequest, NextResponse } from "next/server";

// Import database singleton
const path = require("path");
// const db = require(path.join(process.cwd(), "server", "database"));
//const Chat = require(path.join(process.cwd(), "server", "models", "Chat"));
// const Account = require(path.join(process.cwd(), "server", "models", "Account"));

import db from "@/server/database";
import Account from "@/server/models/Account";
import Chat from "@/server/models/Chat";


// GET - Lấy danh sách chat của user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const exclude = searchParams.get("exclude") || "";

    await db.connect();

    // Tìm email giống từ khóa, loại trừ email của chính mình
    const accounts = await Account.find({
      email: { $regex: q, $options: "i", $ne: exclude },
    })
      .limit(10)
      .select("email");

    return NextResponse.json({ success: true, accounts });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}

// POST - Tạo chat mới
export async function POST(req: NextRequest) {
  try {
    const {
      name,
      avatar,
      participants,
      createdBy,
      chatType = "private",
    } = await req.json();

    if (!name || !participants || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.connect();

    // Đảm bảo participants là mảng và bao gồm createdBy (không trùng)
    let allParticipants = Array.isArray(participants) ? participants : [];
    if (!allParticipants.includes(createdBy)) {
      allParticipants.push(createdBy);
    }
    // Loại bỏ trùng và chuẩn hóa thứ tự
    const uniqueParticipants: string[] = Array.from(new Set(allParticipants));

    // Nếu là private chat giữa 2 người, thử tìm chat cũ trước
    if (chatType === "private" && uniqueParticipants.length === 2) {
      const [p1, p2] = uniqueParticipants;
      const existingChat = await Chat.findOne({
        chatType: "private",
        participants: { $all: [p1, p2], $size: 2 },
      });

      if (existingChat) {
        return NextResponse.json({ success: true, chat: existingChat });
      }
    }

    // Không tìm thấy -> tạo chat mới
    const chatId = Date.now().toString();
    const newChat = await Chat.create({
      id: chatId,
      name,
      avatar: avatar || "/placeholder-user.jpg",
      participants: uniqueParticipants,
      createdBy,
      chatType,
      lastMessage: "",
      lastMessageTimestamp: new Date(),
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
    });

    return NextResponse.json({ success: true, chat: newChat });
  } catch (err) {
    console.error("Error creating chat:", err);
    return NextResponse.json(
      { error: "Server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật chat
export async function PUT(req: NextRequest) {
  try {
    const { chatId, updates } = await req.json();

    if (!chatId) {
      return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
    }

    await db.connect();

    const updatedChat = await Chat.findOneAndUpdate(
      { id: chatId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedChat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      chat: updatedChat,
    });
  } catch (err) {
    console.error("Error updating chat:", err);
    return NextResponse.json(
      { error: "Server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}
