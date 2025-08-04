import { redirect } from "next/navigation";

export default function SubOfficeRootPage() {
  redirect("/sub_office/dashboard");
  return null;
}