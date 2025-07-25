// hooks/useLogin.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

interface LoginData {
  identifier: string;
  password: string;
}

export default function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async ({ identifier, password }: LoginData) => {
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

    setIsLoading(false);

    if (res?.error) {
      toast.error("Login failed", { description: res.error });
      return;
    }

    toast.success("Login successful", {
      description: "Redirecting to your dashboard...",
    });

    // ✅ Redirect based on user role
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    const role = session?.user?.role || "employee";
    const roleRoutes: Record<string, string> = {
      warehouse_admin: "/admin/dashboard",
      warehouse_staff: "/staff/dashboard",
      budget_analyst: "/budget/dashboard",
      engineering: "/engineering/dashboard",
      operations_maintenance: "/operations_maintenance/dashboard",
      manager: "/manager/dashboard",
      employee: "/employee/dashboard",
      finance: "/finance/dashboard",
      sub_office: "/sub_office/dashboard",
      audit: "/audit/dashboard",
    };

    router.push(roleRoutes[role] || "/employee/dashboard");
  };

  return { login, isLoading };
}
