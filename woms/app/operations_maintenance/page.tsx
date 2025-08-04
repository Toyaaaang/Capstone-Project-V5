import { redirect } from "next/navigation";

export default function BudgetRootPage() {
  redirect("/budget/dashboard");
  return null;
}