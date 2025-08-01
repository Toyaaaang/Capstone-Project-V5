"use client"
import { createContext, useContext, useEffect, useState } from "react"

const NotificationContext = createContext<any>(null)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<any[]>([])

  // Fetch notifications from DB on mount
  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(() => setNotifications([]))
  }, [])

  const addNotification = (notification: any) => {
    setNotifications((prev) => [notification, ...prev])
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
