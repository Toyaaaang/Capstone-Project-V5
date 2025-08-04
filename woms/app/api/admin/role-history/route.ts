import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");

  const skip = (page - 1) * PAGE_SIZE;

  try {
    const [totalCount, records] = await Promise.all([
      prisma.roleRequestRecord.count({
        where: {
          status: {
            in: ["approved", "rejected"],
          },
        },
      }),

      prisma.roleRequestRecord.findMany({
        where: {
          status: {
            in: ["approved", "rejected"],
          },
        },
        orderBy: {
          processedAt: "desc",
        },
        include: {
          user: {
            select: {
              username: true,
              idImageUrl: true,
            },
          },
          processedBy: {
            select: {
              username: true,
            },
          },
        },
        skip,
        take: PAGE_SIZE,
      }),
    ]);

    const mapped = records.map((record) => ({
      id: record.id,
      user_username: record.user.username,
      requested_role: record.requestedRole,
      status: record.status,
      processed_by_username: record.processedBy?.username || "Unknown",
      processed_at: record.processedAt,
      idImageUrl: record.user.idImageUrl, 
    }));

    return NextResponse.json({
      data: mapped,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching role request history:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
