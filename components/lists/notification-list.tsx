"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button.tsx";
import { getNotifications, markNotificationAsRead } from "@actions/notifications.ts";

import type { Notification } from "../../types";

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications);
    };
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    );
  };

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="flex items-center justify-between p-4 bg-background rounded-lg shadow">
          <div>
            <p className={`${notification.read ? "text-muted-foreground" : "font-semibold"}`}>{notification.message}</p>
            <p className="text-sm text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
          </div>
          {!notification.read && <Button onClick={() => handleMarkAsRead(notification.id)}>Mark as Read</Button>}
        </div>
      ))}
      {notifications.length === 0 && <p className="text-center text-muted-foreground">No notifications</p>}
    </div>
  );
}
