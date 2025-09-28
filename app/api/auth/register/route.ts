import { NextRequest, NextResponse } from "next/server";
import db from "@/server/database";
import Account from "@/server/models/Account";
import constantMessage from "@/styles/constant";

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, avatarUrl } = await req.json();
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: constantMessage.RegisterMissingFields },
        { status: 400 }
      );
    }

    await db.connect();

    const exists = await Account.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: constantMessage.EmailDuplicate },
        { status: 409 }
      );
    }

    const usernameExists = await Account.findOne({ username });
    if (usernameExists) {
      return NextResponse.json(
        { error: constantMessage.UserNameDuplicate },
        { status: 409 }
      );
    }

    const account = await Account.create({ email, password, username, avatarUrl });
    return NextResponse.json({
      success: true,
      message: "Account created",
      account: { email: account.email, username: account.username, avatarUrl: account.avatarUrl },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}


