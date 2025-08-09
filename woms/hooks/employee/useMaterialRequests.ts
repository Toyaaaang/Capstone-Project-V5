import { useEffect, useState } from "react";

export function useMaterialRequests() {
  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const pageSize = 8;

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNumber.toString(),
        page_size: pageSize.toString(),
      }).toString();
      
      const res = await fetch(`/api/material-requests/my-requests?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch material requests");
      const { results, count } = await res.json();
      setData(results);
      setTotalCount(count);
    } catch (err) {
      console.error("Failed to fetch material requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return {
    data,
    totalCount,
    page,
    setPage,
    isLoading,
    refetch: () => fetchData(page),
  };
}
