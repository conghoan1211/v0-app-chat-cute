// Push notification utilities
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export async function subscribeToPush(userEmail: string): Promise<boolean> {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push messaging is not supported');
      return false;
    }

    const permission = await requestNotificationPermission();
    if (!permission) {
      console.log('Notification permission denied');
      return false;
    }

    // Register service worker and wait for it to be ready
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
    
    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;
    console.log('Service Worker is ready');

    // Convert VAPID key to Uint8Array
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      console.error('VAPID public key not configured');
      return false;
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource
    });

    console.log('Push subscription created:', subscription);

    // Send subscription to server
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription,
        userEmail
      })
    });

    if (response.ok) {
      console.log('Push subscription successful');
      return true;
    } else {
      console.error('Failed to store push subscription');
      return false;
    }
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return false;
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function sendPushNotification(userEmail: string, title: string, body: string, data?: any) {
  try {
    const response = await fetch('/api/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail,
        title,
        body,
        data
      })
    });

    if (response.ok) {
      console.log('Push notification sent successfully');
      return true;
    } else {
      console.error('Failed to send push notification');
      return false;
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}
