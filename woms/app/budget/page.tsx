import { redirect } from "next/navigation";

export default function AdminRootPage() {
  redirect("/budget/dashboard");
  return null;
}