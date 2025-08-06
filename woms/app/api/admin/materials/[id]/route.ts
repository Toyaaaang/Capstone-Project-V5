import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper to check admin
async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "warehouse_admin";
}

// PATCH: Update a material by ID (admin only)
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  try {
    const material = await prisma.material.update({
      where: { id },
      data,
    });
    return NextResponse.json(material);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update material" }, { status: 400 });
  }
}