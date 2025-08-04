import { redirect } from "next/navigation";

export default function AuditRootPage() {
  redirect("/audit/dashboard");
  return null;
}