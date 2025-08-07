import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit-log";

// Utility: Summarize changed fields for audit log
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getChangedFieldsSummary(oldData: any, newData: any): string {
  const changes: string[] = [];
  for (const key in newData) {
    if (newData[key] !== oldData[key]) {
      changes.push(`${key}: "${oldData[key]}" → "${newData[key]}"`);
    }
  }
  return changes.length ? changes.join(", ") : "No visible changes";
}

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
    const oldMaterial = await prisma.material.findUnique({ where: { id } });
    const material = await prisma.material.update({
      where: { id },
      data,
    });

    await logAudit(
      "Material Updated",
      `Material "${oldMaterial?.name}" was updated. Modified fields: ${getChangedFieldsSummary(oldMaterial, data)}`
    );

    return NextResponse.json(material);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update material" }, { status: 400 });
  }
}