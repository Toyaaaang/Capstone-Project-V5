import { redirect } from "next/navigation";

export default function StaffRootPage() {
  redirect("/warehouse_staff/dashboard");
  return null;
}