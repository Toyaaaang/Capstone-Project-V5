import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const PAGE_SIZE = 8;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const page = parseInt(new URL(req.url).searchParams.get("page") || "1");

  const [results, count] = await Promise.all([
    prisma.materialRequest.findMany({
      where: { requesterId: user.id },
      include: { items: true },
      orderBy: [{ createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.materialRequest.count({ where: { requesterId: user.id } }),
  ]);

  return NextResponse.json({
    results,
    count,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(count / PAGE_SIZE),
  });
}