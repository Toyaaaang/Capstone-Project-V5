import { redirect } from "next/navigation";

export default function EmployeeRootPage() {
  redirect("/employee/dashboard");
  return null;
}