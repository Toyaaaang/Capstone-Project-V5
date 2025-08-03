"use client";

import { useAuditLogs } from "@/hooks/admin/useAuditLogs";
import DataTable from "@/components/Tables/DataTable";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { useCallback } from "react";

export default function AuditLogsPage() {
  const {
    data,
    total,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    loading,
    error,
  } = useAuditLogs();

  // Optional: handle search input change
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1); // reset to first page on search
    },
    [setSearch, setPage]
  );

  return (
    <div className="max-w-full mx-auto">
      <DataTable
        columns={columns}
        data={data}
        title="Audit Logs"
        page={page}
        setPage={setPage}
        totalCount={total}
        pageSize={limit}
        filters={
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search action or description..."
              value={search}
              onChange={handleSearch}
              className="w-64"
              disabled={loading}
            />
            {/* You can add more filters here */}
          </div>
        }
      />
      {loading && <div className="mt-4 text-blue-500">Loading...</div>}
      {error && <div className="mt-4 text-red-500">Error: {error}</div>}
    </div>
  );
}