"use client";

import { useAuditLogs } from "@/hooks/admin/useAuditLogs";
import DataTable from "@/components/Tables/DataTable";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { useCallback } from "react";
import TableLoader from "@/components/Loaders/TableLoader";

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
  if (loading) return <TableLoader />;
  if (error) return <div>Error: {error}</div>;
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
    </div>
  );
}