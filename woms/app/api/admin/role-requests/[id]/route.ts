// app/api/admin/role-requests/[id]/route.ts
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendNotification } from "@/lib/notify";
import { logAudit } from "@/lib/audit-log";

// Utility function
function formatRole(role: string) {
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { action } = await req.json(); // action: 'approve' | 'reject'

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const roleRequest = await prisma.roleRequestRecord.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!roleRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const isApproved = action === "approve";

  // Start transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: roleRequest.userId },
      data: {
        isRoleConfirmed: isApproved,
        role: isApproved ? roleRequest.requestedRole : roleRequest.user.role,
      },
    }),
    prisma.roleRequestRecord.update({
      where: { id },
      data: {
        status: isApproved ? "approved" : "rejected",
        processedBy: { connect: { id: session.user.id } },
        processedAt: new Date(),
      },
    }),
  ]);

  // Send notification to the user
  await sendNotification({
    userId: roleRequest.userId,
    title: isApproved
      ? "Role Request Approved"
      : "Role Request Rejected",
    body: isApproved
      ? `Your request for the role "${formatRole(roleRequest.requestedRole)}" has been approved.`
      : `Your request for the role "${formatRole(roleRequest.requestedRole)}" has been rejected.`,
  });

  // Log audit entry
  await logAudit(
    isApproved ? "approve role" : "reject role",
    `Role request for "${formatRole(roleRequest.requestedRole)}" was ${isApproved ? "approved" : "rejected"} by ${session.user.email}`,
    session.user.id
  );

  return NextResponse.json({ success: true });
}
