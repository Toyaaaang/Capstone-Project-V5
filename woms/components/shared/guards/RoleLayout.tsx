"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/Loaders/loading-spinner"; 

export default function RoleLayout({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    const role = session?.user?.role;
    if (role && allowedRoles.includes(role)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      router.replace("/auth/unauthorized");
    }
  }, [status, session, allowedRoles, router]);

  if (status === "loading" || isAuthorized === null) {
    return <LoadingSpinner />; // or return null
  }

  if (!isAuthorized) return null;

  return <>{children}</>;
}
