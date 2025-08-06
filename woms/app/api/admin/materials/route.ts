import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper to check admin
async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "warehouse_admin";
}

// GET: List all materials (admin only), with pagination
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("page_size") || "10");
  const skip = (page - 1) * pageSize;

  const [materials, count] = await Promise.all([
    prisma.material.findMany({
      orderBy: { name: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.material.count(),
  ]);

  return NextResponse.json({
    results: materials,
    count,
  });
}

// POST: Create a new material (admin only)
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  try {
    const material = await prisma.material.create({ data });
    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create material" }, { status: 400 });
  }
}