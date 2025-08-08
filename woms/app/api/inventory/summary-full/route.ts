import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * PAGE_SIZE;

  // Add visible filter to all queries
  let where: any = { material: { visible: true } };

  if (
    user.role && ["manager", "warehouse_admin", "warehouse_staff"].includes(user.role)
  ) {
    where = { material: { visible: true } };
  } else if (
    user.role && ["engineering", "operations_maintenance"].includes(user.role)
  ) {
    where = { material: { NOT: { category: "office_supply" }, visible: true } };
  } else if (user.role === "finance") {
    where = { material: { category: "office_supply", visible: true } };
  } else {
    where = { material: { category: "uncategorized", visible: true } };
  }

  const [results, count] = await Promise.all([
    prisma.inventory.findMany({
      where,
      include: { material: true },
      orderBy: { material: { name: "asc" } },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.inventory.count({ where }),
  ]);

  const summary = results.map((inv) => ({
    name: inv.material.name,
    unit: inv.material.unit,
    quantity: inv.quantity,
    category: inv.material.category,
  }));

  return NextResponse.json({ results: summary, count });
}