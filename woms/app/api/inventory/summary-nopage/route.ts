import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Add visible filter to all queries
  let where: any = { material: { visible: true } };
  if (
    user.role && ["manager", "warehouse_admin", "warehouse_staff"].includes(user.role)
  ) {
    // All categories, but only visible materials
    where = { material: { visible: true } };
  } else if (
    user.role && ["engineering", "operations_maintenance"].includes(user.role)
  ) {
    // Exclude office_supply, only visible materials
    where = { material: { NOT: { category: "office_supply" }, visible: true } };
  } else if (user.role === "finance") {
    // Only office_supply, only visible materials
    where = { material: { category: "office_supply", visible: true } };
  } else {
    // Only uncategorized, only visible materials
    where = { material: { category: "uncategorized", visible: true } };
  }

  const inventory = await prisma.inventory.findMany({
    where,
    include: { material: true },
    orderBy: { material: { name: "asc" } },
  });

  // Map to summary format
  const summary = inventory.map((inv) => ({
    name: inv.material.name,
    unit: inv.material.unit,
    quantity: inv.quantity,
    category: inv.material.category,
  }));

  return NextResponse.json(summary);
}