import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department");

  if (!department) {
    return NextResponse.json({ error: "Missing department parameter" }, { status: 400 });
  }

  const where: any = { material: { visible: true } };

  if (["engineering", "operations_maintenance"].includes(department)) {
    // Show all inventory except office supplies
    where.material.NOT = { category: "office_supply" };
  } else if (department === "finance") {
    // Show only office supplies
    where.material.category = "office_supply";
  } else {
    // Default: show nothing
    return NextResponse.json([], { status: 200 });
  }

  const inventory = await prisma.inventory.findMany({
    where,
    include: { material: true },
    orderBy: { material: { name: "asc" } },
  });

  // Format response similar to Django serializer
  const results = inventory.map(inv => ({
    id: inv.id,
    material: {
      id: inv.material.id,
      name: inv.material.name,
      unit: inv.material.unit,
      category: inv.material.category,
      description: inv.material.description,
      visible: inv.material.visible,
    },
    material_name: inv.material.name,
    unit: inv.material.unit,
    quantity: inv.quantity,
    updatedAt: inv.updatedAt,
  }));

  return NextResponse.json(results);
}