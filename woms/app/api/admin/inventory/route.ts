import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit-log"; // <-- Add this import

// Only admin users can access
async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "warehouse_admin";
}

// GET: List all inventory items (admin only)
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const inventory = await prisma.inventory.findMany({
      include: { material: true },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

// POST: Create a new inventory item (admin only)
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  try {
    const inventory = await prisma.inventory.create({
      data,
      include: { material: true },
    });

    // Audit log
    await logAudit(
      "Inventory added",
      `Inventory item for material "${inventory.material?.name}" created with quantity ${inventory.quantity}.`
    );

    return NextResponse.json(inventory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inventory" }, { status: 400 });
  }
}