"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DataTable from "@/components/Tables/DataTable";
import TableLoader from "@/components/Loaders/TableLoader";
import { columns } from "./columns";
import { useRoleHistory } from "@/hooks/admin/useApprovalHistory";
import { SearchAndFilter } from "@/components/ui/SearchAndFilter"; // <-- Import your new component

export default function RoleHistoryPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const {
    data,
    loading,
    error,
    page,
    setPage,
    totalCount,
    refreshData,
  } = useRoleHistory({ search: debouncedSearch }); // Pass debounced search

  const searchParams = useSearchParams();

  if (loading) return <TableLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <DataTable
        title="Approval History"
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalCount={totalCount}
        refreshData={refreshData}
        filters={
          <SearchAndFilter
            searchPlaceholder="Search user, role, status..."
            searchValue={search}
            onSearchChange={setSearch}
          />
        }
      />
    </div>
  );
}
