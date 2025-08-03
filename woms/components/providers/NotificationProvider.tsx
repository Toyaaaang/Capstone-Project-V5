"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner";

const NotificationContext = createContext<unknown>(null)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<unknown[]>([]);

  // Fetch notifications from DB on mount
  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : [])) // <-- ensure array
      .catch(() => setNotifications([]));
  }, []);

  const addNotification = (notification: any) => {

    setNotifications((prev) => [notification, ...prev])

    setNotifications((prev) => Array.isArray(prev) ? [notification, ...prev] : [notification]);
    toast(notification.title, {
      description: notification.body,
      action: notification.link
        ? {
            label: "View",
            onClick: () => window.location.href = notification.link,
          }
        : undefined,
    });
  }

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" })
  }

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    await fetch(`/api/notifications/${id}`, { method: "DELETE" })
  }

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    await fetch("/api/notifications/mark-all-read", { method: "PATCH" })
  }

  const clearAllNotifications = async () => {
    setNotifications([])
    await fetch("/api/notifications/clear-all", { method: "DELETE" })
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        deleteNotification,
        markAllAsRead,
        clearAllNotifications,
        isAuthenticated: true, // Simplified for now
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
