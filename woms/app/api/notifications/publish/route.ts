import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const { userId, role, message } = await req.json();

  const payload = {
    userId,
    role,
    message,
    timestamp: Date.now(),
  };

  // Send to individual user
  if (userId) {
    await redis.publish(`notifications:user:${userId}`, JSON.stringify(payload));
  }

  // Send to all users with a specific role
  if (role) {
    await redis.publish(`notifications:role:${role}`, JSON.stringify(payload));
  }

  return NextResponse.json({ success: true });
}