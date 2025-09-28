import { NextRequest, NextResponse } from "next/server";
import { pushSubscriptions } from "../subscribe/route";
import webpush from 'web-push';

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  'mailto:hoanpham12112003@gmail.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userEmail, title, body, data } = await req.json();
    
    if (!userEmail) {
      return NextResponse.json(
        { error: "Missing userEmail" },
        { status: 400 }
      );
    }

    const subscription = pushSubscriptions.get(userEmail);
    
    if (!subscription) {
      return NextResponse.json(
        { error: "No push subscription found for user" },
        { status: 404 }
      );
    }

    // const payload = JSON.stringify({
    //   title: title || "Tin nhắn mới",
    //   body: body || "Bạn có tin nhắn mới!",
    //   icon: "/placeholder-logo.png",
    //   badge: "/placeholder-logo.png",
    //   data: data || {},
    //   tag: 'chat-message',
    //   requireInteraction: true,
    //   silent: false
    // });

    const payload = JSON.stringify({
      title: title || "Tin nhắn mới",
      body: body || "Bạn có tin nhắn mới!",
      data: data || {}, // chỉ gửi data cần
    });

    try {
      await webpush.sendNotification(subscription, payload);
      console.log('Push notification sent successfully');
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Web-push error:', error);
      
      // If subscription is invalid, remove it
      if (error.statusCode === 410) {
        pushSubscriptions.delete(userEmail);
        console.log('Removed invalid subscription for user:', userEmail);
      }
      
      throw error;
    }
  } catch (err) {
    console.error("Error sending push notification:", err);
    return NextResponse.json(
      { error: "Server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}
