// app/api/admin/role-requests/route.ts
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roleRequests = await prisma.roleRequestRecord.findMany({
    where: { status: "pending" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          department: true,
          suboffice: true,
          role: true,
          isRoleConfirmed: true,
          idImageUrl: true,
        },
      },
    },
    orderBy: { processedAt: "desc" },
  });

  return NextResponse.json(roleRequests);
}
