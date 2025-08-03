"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Trash2, CheckCircle2 } from "lucide-react";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default function SidebarNotifications() {
  const {
    notifications = [],
    loading,
    error,
    isAuthenticated,
    markAsRead,
    deleteNotification,
    clearAllNotifications,
    markAllAsRead,
  } = useNotifications();

  const router = useRouter();

  if (isAuthenticated === false || isAuthenticated === null) {
    return null;
  }

  const notificationsArray = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notificationsArray.filter((n: { read: any; }) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative group">
          <Bell className="h-10 w-10 text-blue-300 transition-colors duration-200 group-hover:text-black" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 select-none">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-100 p-2 mr-6">
        {loading ? (
          <DropdownMenuItem disabled className="text-gray-500">
            Loading notifications...
          </DropdownMenuItem>
        ) : error ? (
          <DropdownMenuItem disabled className="text-red-500">
            Error: {error}
          </DropdownMenuItem>
        ) : notificationsArray.length === 0 ? (
          <DropdownMenuItem disabled className="text-gray-500">
            No notifications
          </DropdownMenuItem>
        ) : (
          <>
            {notificationsArray.map((notification: { id: Key | null | undefined; read: any; link: string; title: any; body: any; createdAt: any; }) => (
              <DropdownMenuItem
                key={notification.id}
                onSelect={(e) => e.preventDefault()}
                className={`flex items-center justify-between space-x-2 p-2 rounded-md ${
                  notification.read ? "text-gray-500" : "font-bold"
                }`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                  if (notification.link) {
                    router.push(notification.link);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="flex items-center space-x-2 flex-grow">
                  {!notification.read && (
                    <span className="h-2 w-2 bg-red-500 rounded-full flex-shrink-0"></span>
                  )}
                  <div className="flex flex-col">
                    <span><b>{notification.title}</b></span>
                    <span className="text-xs text-gray-400 font-normal">
                      {notification.body}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {notification.createdAt
                    ? formatDistanceToNow(new Date(notification.createdAt)) + " ago"
                    : ""}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-red-100 p-1"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </DropdownMenuItem>
            ))}

            {/* Only show these buttons if there are notifications */}
            {notificationsArray.length > 0 && (
              <>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex justify-center mt-2"
                >
                  <Button
                    variant="ghost"
                    className="text-green-600 w-full"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={markAllAsRead}
                  >
                    <CheckCircle2 className="w-full h-4 mr-1" />
                    Mark All as Read
                  </Button>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex justify-center"
                >
                  <Button
                    variant="ghost"
                    className="text-red-500 w-full"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={clearAllNotifications}
                  >
                    <Trash2 className="w-full h-4 mr-1" />
                    Clear All
                  </Button>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
