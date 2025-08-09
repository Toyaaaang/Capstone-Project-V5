import { redirect } from "next/navigation";

export default function StaffRootPage() {
  redirect("/staff/dashboard");
  return null;
}