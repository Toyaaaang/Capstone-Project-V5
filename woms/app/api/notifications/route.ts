import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const role = session.user.role;

  // Fetch notifications for user and their role, most recent first
  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { userId },
        { role: role as any ?? undefined }
      ]
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(notifications);
}