"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChartAreaInteractive } from "@/components/charts/charts";
import { SectionCards } from "@/components/charts/SectionCards";

export default function WarehouseAdminOverview() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // If no session or wrong role, redirect
    if (!session?.user || session.user.role !== "warehouse_admin") {
      router.replace("/auth/login");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <p className="text-center mt-10">Checking permissions...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Warehouse Admin Overview</h1>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards role="warehouse_admin" />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
