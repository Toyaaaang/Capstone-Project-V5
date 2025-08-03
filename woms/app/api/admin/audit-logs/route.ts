import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Only warehouse_admin or higher roles should be able to fetch audit logs
const ALLOWED_ROLES = ["warehouse_admin", "admin", "super_admin"];

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || typeof user.role !== "string" || !ALLOWED_ROLES.includes(user.role)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const userId = searchParams.get("userId");

  const whereClause = userId ? { userId } : {};

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: { user: true },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({
      where: whereClause,
    }),
  ]);

  return Response.json({
    data: logs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
