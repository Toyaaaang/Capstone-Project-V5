import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export function useAuditLogs({
  initialPage = 1,
  initialLimit = 10,
  initialUserId = "",
  initialSearch = "",
}: {
  initialPage?: number;
  initialLimit?: number;
  initialUserId?: string;
  initialSearch?: string;
} = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [userId, setUserId] = useState(initialUserId);
  const [search, setSearch] = useState(initialSearch);

  const debouncedSearch = useDebounce(search, 500);

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (userId) params.append("userId", userId);
    if (debouncedSearch) params.append("search", debouncedSearch);

    fetch(`/api/admin/audit-logs?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((json) => {
        setData(json.data);
        setTotal(json.total);
        setTotalPages(json.totalPages);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, limit, userId, debouncedSearch]);

  return {
    data,
    total,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    userId,
    setUserId,
    search,
    setSearch,
    loading,
    error,
  };
}