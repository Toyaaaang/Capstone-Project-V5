import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { sendNotification } from "@/lib/notify";
import { logAudit } from "@/lib/audit-log";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const {
    department,
    purpose,
    location,
    latitude,
    longitude,
    items,
    manpower,
    targetCompletion,
    actualCompletion,
    duration,
    requesterDepartment,
  } = data;

  // Generate workOrderNo if needed
  let workOrderNo: string | undefined = undefined;
  if (
    !data.workOrderNo &&
    (department === "engineering" || department === "operations_maintenance")
  ) {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));
    const deptCount =
      (await prisma.materialRequest.count({
        where: {
          department,
          createdAt: { gte: todayStart, lte: todayEnd },
        },
      })) + 1;
    const prefix = department === "engineering" ? "WO-ENG" : "WO-OPS";
    workOrderNo = `${prefix}-${dateStr}-${String(deptCount).padStart(3, "0")}`;
  }

  // Generate referenceCode like MR-1
  const totalCount = (await prisma.materialRequest.count()) + 1;
  const referenceCode = `MR-${totalCount}`;

  // Create the MaterialRequest
  const createdRequest = await prisma.materialRequest.create({
    data: {
      requesterId: user.id,
      department,
      purpose,
      location,
      latitude,
      longitude,
      manpower,
      targetCompletion: targetCompletion ? new Date(targetCompletion) : undefined,
      actualCompletion: actualCompletion ? new Date(actualCompletion) : undefined,
      duration,
      requesterDepartment,
      workOrderNo,
      referenceCode,
      items: {
        create: items.map((item: any) => ({
          materialId: item.material_id ? String(item.material_id) : undefined,
          customName: item.custom_name || undefined,
          customUnit: item.custom_unit || undefined,
          quantity: item.quantity,
          unit: item.unit,
        })),
      },
    },
    include: {
      items: {
        include: { material: true },
      },
      requester: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });

  // Notify department users
  const recipients = await prisma.user.findMany({
    where: {
      role: department,
      isRoleConfirmed: true,
    },
  });

  for (const recipient of recipients) {
    await sendNotification({
      userId: recipient.id,
      title: "New Material Request",
      body: `${user.firstName} ${user.lastName} submitted a new material request for evaluation. Reference: ${createdRequest.referenceCode}`,
      link: `/${department}/material-requests/${createdRequest.id}/items`,
    });
  }

  // Audit log: who requested and on what dept
  await logAudit(
    "Create Material Request",
    `User ${user.firstName} ${user.lastName} submitted a material request to department: ${department}`,
    user.id
  );

  return NextResponse.json(createdRequest, { status: 201 });
}