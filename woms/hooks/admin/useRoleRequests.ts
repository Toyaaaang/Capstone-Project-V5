"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type RoleRequest = {
  id: string;
  requestedRole: string;
  processedAt: string;
  status: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isRoleConfirmed: boolean;
    department?: string | null;
    suboffice?: string | null;
    idImageUrl?: string | null;
  };
};

export function useRoleRequests() {
  const router = useRouter();
  const [data, setData] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRoleRequests = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/role-requests?page=${pageNumber}`);
      const json = await res.json();

      const rawData = Array.isArray(json) ? json : json.data ?? [];

      const mapped = rawData.map((item: any) => ({
        id: item.id,
        requestedRole: item.requestedRole,
        processedAt: item.processedAt,
        status: item.status,
        user: {
          id: item.user.id,
          firstName: item.user.firstName,
          lastName: item.user.lastName,
          email: item.user.email,
          isRoleConfirmed: item.user.isRoleConfirmed,
          department: item.user.department,
          suboffice: item.user.suboffice,
          idImageUrl: item.user.idImageUrl,
        },
      }));

      setData(mapped);
      setTotalCount(json.totalCount || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch role requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleRequests(page);
  }, [page]);

  const approveRoleRequest = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/role-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      if (!res.ok) throw new Error("Approval failed");

      toast.success("Role approved successfully!");

      await fetchRoleRequests(page);
      router.push(`/admin/role-history`);
    } catch (err) {
      console.error("Approve failed:", err);
      toast.error("Failed to approve role");
    }
  };

  const rejectRoleRequest = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/role-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });

      if (!res.ok) throw new Error("Rejection failed");

      toast.success("Role rejected successfully!");
      router.push(`/admin/role-history`);
      await fetchRoleRequests(page);
    } catch (err) {
      console.error("Reject failed:", err);
      toast.error("Failed to reject role");
    }
  };

  return {
    data,
    loading,
    error,
    page,
    setPage,
    totalCount,
    fetchRoleRequests,
    approveRoleRequest,
    rejectRoleRequest,
    refreshData: () => fetchRoleRequests(page),
  };
}
