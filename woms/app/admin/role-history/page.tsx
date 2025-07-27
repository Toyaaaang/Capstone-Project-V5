"use client";

import { useSearchParams } from "next/navigation";
import DataTable from "@/components/Tables/DataTable";
import TableLoader from "@/components/Loaders/TableLoader";
import { columns } from "./columns";
import { useRoleHistory } from "@/hooks/admin/useApprovalHistory"; 
export default function RoleHistoryPage() {
  const {
    data,
    loading,
    error,
    page,
    setPage,
    totalCount,
    refreshData,
  } = useRoleHistory(); 

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
      />
    </div>
  );
}
