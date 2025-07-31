import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

export async function sendNotification({
  userId,
  role,
  title,
  body, // <-- use body, not message
  link,
}: {
  userId?: string;
  role?: string;
  title: string;
  body: string; // <-- use body
  link?: string;
}) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      role: role as any, // or as Role if you import the enum
      title,
      body,
      link,
    },
  });

  const payload = {
    id: notification.id,
    userId,
    role,
    title,
    body, // <-- use body
    link,
    createdAt: notification.createdAt,
  };

  const channel = userId ? `user:${userId}` : role ? `role:${role}` : undefined;
  if (channel) {
    // Store notification in Redis list (queue style)
    await redis.rpush(channel, JSON.stringify(payload));
  }

  return notification;
}
