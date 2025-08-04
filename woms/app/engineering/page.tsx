import { redirect } from "next/navigation";

export default function EngineeringRootPage() {
  redirect("/engineering/dashboard");
  return null;
}