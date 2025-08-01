import { useEffect } from "react"
import { useNotifications } from "@/components/providers/NotificationProvider"

export const useNotificationStream = () => {
  const { addNotification } = useNotifications()

  useEffect(() => {
    const eventSource = new EventSource("/api/notifications/stream")

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      addNotification(notification)
    }

    eventSource.onerror = (err) => {
      console.error("SSE error:", err)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [addNotification])
}
