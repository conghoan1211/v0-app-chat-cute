import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Import database singleton
const path = require("path");
import Account from "@/server/models/Account";
import db from "@/server/database";

// GET - Lấy danh sách tài khoản
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const currentUserEmail = searchParams.get("currentUserEmail");
    const checkEmail = searchParams.get("checkEmail");

    // Kết nối database
    await db.connect();

    // Nếu checkEmail được cung cấp, kiểm tra sự tồn tại của tài khoản và trả về kết quả
    if (checkEmail) {
      await db.connect();
      const exists = await Account.exists({ email: checkEmail });
      return NextResponse.json({ success: true, exists: !!exists });
    }

    let query: any = {};

    // Nếu có search, tìm theo email
    if (search) {
      query.email = { $regex: search, $options: "i" };
    }

    // Loại bỏ user hiện tại khỏi danh sách
    if (currentUserEmail) {
      if (query.email) {
        query.email = { ...query.email, $ne: currentUserEmail };
      } else {
        query.email = { $ne: currentUserEmail };
      }
    }

    // Lấy danh sách tài khoản
    const accounts = await Account.find(query, {
      email: 1,
      username: 1,
      avatarUrl: 1,
      _id: 0,
    })
      .limit(50)
      .sort({ email: 1 });

    return NextResponse.json({
      success: true,
      accounts: accounts,
    });
  } catch (err) {
    console.error("Error fetching accounts:", err);
    return NextResponse.json(
      { error: "Server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}
