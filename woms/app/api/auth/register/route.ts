import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@/app/generated/prisma";
import { sendNotification } from "@/lib/notify";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      username,
      email,
      password,
      role,
      firstName,
      lastName,
      department,
      suboffice,
      idImageUrl,
    } = body;

    // 🔍 Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ message: "Email already in use." }, { status: 400 });
    }

    // 🔐 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧑 Create the user with unconfirmed role
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        firstName,
        lastName,
        department,
        suboffice,
        idImageUrl,
        isRoleConfirmed: false, // User role must be confirmed by admin
      },
    });

    try {
      await prisma.roleRequestRecord.create({
        data: {
          userId: newUser.id,
          requestedRole: role as Role,
          status: "pending",
        },
      });
    } catch (err) {
      console.error("Role request creation failed:", err);
    }

    await sendNotification({
    role: "warehouse_admin",
    title: "New Role Request",
    body: `${newUser.firstName} ${newUser.lastName} has registered and is awaiting role confirmation.`,
    link: "/admin/role-requests",
  });

    return NextResponse.json({ message: "User registered and pending role approval." }, { status: 201 });
  } catch (err) {
    console.error("[REGISTER_ERROR]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
