import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { logAudit } from "@/lib/audit-log";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL!,
});

// Only allow POST
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const image = formData.get("image") as File;

  if (!image) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await image.arrayBuffer());

  try {
    // 📤 Upload to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "signatures",
            public_id: `signature-${session.user.id}-${Date.now()}`,
            format: "png",
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result as any);
          }
        )
        .end(buffer);
    });

    // 🛠️ Save to DB
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { signature: uploadResult.secure_url },
    });

    // 📝 Log audit entry for e-signature change/add
    await logAudit(
      "update signature",
      `User ${updatedUser.username} updated their e-signature.`,
      updatedUser.id
    );

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("[SIGNATURE_UPLOAD_ERROR]", error);
    return NextResponse.json({ error: "Failed to upload signature" }, { status: 500 });
  }
}
