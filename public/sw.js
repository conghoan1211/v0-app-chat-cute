// Service Worker for Push Notifications
self.addEventListener('push', function (event) {
    let notificationData = {
        title: 'Tin nhắn mới',
        body: 'Bạn có tin nhắn mới!',
        icon: '/chat-icon.png',
        badge: '/chat-badge.png',
        data: {}
    };

    if (event.data) {
        try {
            const payload = event.data.json();
            notificationData = {
                ...notificationData,
                ...payload
            };
        } catch (e) {
            notificationData.body = event.data.text();
        }
    }

    const options = {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        vibrate: [200, 100, 200],
        requireInteraction: true,
        data: notificationData.data,
        actions: [
            { action: 'open', title: '💬 Xem tin nhắn' },
            { action: 'close', title: 'Đóng' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(notificationData.title, options)
    );
});


self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received:', event);

    event.notification.close();

    if (event.action === 'open' || !event.action) {
        // Open the chat app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

self.addEventListener('notificationclose', function (event) {
    console.log('Notification closed:', event);
});
