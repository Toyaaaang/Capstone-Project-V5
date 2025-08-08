"use client";

import { useState, useEffect } from "react";

type ApprovalHistory = {
  id: string;
  user_username: string;
  requested_role: string;
  status: string;
  processed_by_username: string;
  processed_at: string;
  idImageUrl?: string;
};

export function useRoleHistory({ search }: { search: string }) {
  const [data, setData] = useState<ApprovalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRoleHistory = async (pageNumber = 1, searchValue = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/role-history?page=${pageNumber}&search=${encodeURIComponent(
          searchValue
        )}`
      );
      const json = await res.json();

      const rawData = Array.isArray(json) ? json : json.data ?? [];

      const mapped = rawData.map((item: any) => ({
        id: item.id,
        user_username: item.user_username,
        requested_role: item.requested_role,
        status: item.status,
        processed_by_username: item.processed_by_username,
        processed_at: item.processed_at,
        idImageUrl: item.idImageUrl, // <-- add this line
      }));

      setData(mapped);
      setTotalCount(json.totalCount || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch approval history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleHistory(page, search);
  }, [page, search]);

  return {
    data,
    loading,
    error,
    page,
    setPage,
    totalCount,
    refreshData: () => fetchRoleHistory(page, search),
  };
}
