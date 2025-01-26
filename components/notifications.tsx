"use client";

import { useState, useEffect } from "react";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { getNotifications, markNotificationAsRead } from "@actions/notifications.ts";

import type { Notification } from "../types";

export function Notifications() {
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
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {notifications.some((n) => !n.read) && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new notifications</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="flex items-center space-x-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{notification.message}</p>
                  <p className="text-sm text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
                {!notification.read && (
                  <Button size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                    Mark as read
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
