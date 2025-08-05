import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit-log";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { first_name, last_name } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { firstName: true, lastName: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: first_name,
        lastName: last_name,
      },
    });

    await logAudit(
      "Update Name",
      `Updated name from "${existingUser.firstName} ${existingUser.lastName}" to "${updatedUser.firstName} ${updatedUser.lastName}"`,
      session.user.id
    );

    return NextResponse.json({
      message: "Name updated successfully",
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    });
  } catch (error) {
    console.error("Top-level error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        // add other fields as needed
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Top-level error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
