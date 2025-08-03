import { prisma } from "@/lib/prisma"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Logs an audit entry for the current user or a system action.
 * @param action - A short action key (e.g. 'register', 'approve_role')
 * @param description - A full description (e.g. 'User registered with email...')
 * @param userIdOverride - (Optional) specify user manually if outside of session
 */
export async function logAudit(
  action: string,
  description: string,
  userIdOverride?: string
) {
  try {
    let userId = userIdOverride;

    if (!userId) {
      const session = await getServerSession(authOptions);
      userId = session?.user?.id ?? undefined;
    }

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        description,
      },
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}
