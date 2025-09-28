import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Dùng singleton database
const path = require("path");
// const db = require(path.join(process.cwd(), "server", "database"));
// const Account = require(path.join(process.cwd(), "server", "models", "Account"));
import db from "@/server/database";
import Account from "@/server/models/Account";
import constantMessage from "@/styles/constant";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: constantMessage.RegisterMissingFields },
        { status: 400 }
      );
    }
    // Kết nối MongoDB chỉ 1 lần duy nhất
    await db.connect();

    let account = await Account.findOne({ email });
    if (!account) {
      return NextResponse.json(
        { error: constantMessage.AccountNotFound },
        { status: 404 }
      );
    } else if (account.password === password) {
      return NextResponse.json({
        success: true,
        message: "Login successful",
        account: { email: account.email },
      });
    } else {
      return NextResponse.json(
        { error: constantMessage.WrongPassword },
        { status: 401 }
      );
    }
  } catch (err) {
    console.error("❌ Auth API error:", err);
    return NextResponse.json(
      { error: "Server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}
