import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit-log";

// Only admin users can access
async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "warehouse_admin";
}

// Utility: Summarize changed fields for audit log
function getChangedFieldsSummary(oldData: any, newData: any): string {
  const changes: string[] = [];
  for (const key in newData) {
    if (newData[key] !== oldData[key]) {
      changes.push(`${key}: "${oldData[key]}" → "${newData[key]}"`);
    }
  }
  return changes.length ? changes.join(", ") : "No visible changes";
}

// PATCH: Update an inventory item by ID (admin only)
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const updateData: any = {};
  if (data.materialId) updateData.materialId = data.materialId;
  if (data.quantity !== undefined) updateData.quantity = Number(data.quantity);

  try {
    const oldInventory = await prisma.inventory.findUnique({
      where: { id },
      include: { material: true },
    });

    const inventory = await prisma.inventory.update({
      where: { id },
      data: updateData,
      include: { material: true },
    });

    await logAudit(
      "Inventory update",
      `Inventory item "${oldInventory?.material?.name ?? id}" updated. Changes: ${getChangedFieldsSummary(oldInventory, updateData)}`
    );

    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 400 });
  }
}