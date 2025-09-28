import { NextRequest, NextResponse } from "next/server";
import db from "@/server/database";

// Store push subscriptions in memory (in production, use Redis or database)
const pushSubscriptions = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const { subscription, userEmail } = await req.json();
    
    if (!subscription || !userEmail) {
      return NextResponse.json(
        { error: "Missing subscription or userEmail" },
        { status: 400 }
      );
    }

    // Store subscription for user
    pushSubscriptions.set(userEmail, subscription);
    
    console.log(`Push subscription stored for user: ${userEmail}`);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error storing push subscription:", err);
    return NextResponse.json(
      { error: "Server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");
    
    if (!userEmail) {
      return NextResponse.json(
        { error: "Missing userEmail parameter" },
        { status: 400 }
      );
    }

    const subscription = pushSubscriptions.get(userEmail);
    
    return NextResponse.json({ 
      success: true, 
      hasSubscription: !!subscription,
      subscription 
    });
  } catch (err) {
    console.error("Error getting push subscription:", err);
    return NextResponse.json(
      { error: "Server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}

// Export for use in other modules
export { pushSubscriptions };
