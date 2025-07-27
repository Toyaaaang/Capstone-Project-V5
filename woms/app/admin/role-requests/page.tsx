"use client";

import { useRoleRequests } from "@/hooks/admin/useRoleRequests";
import DataTable from "@/components/Tables/DataTable";
import { columns } from "./columns";
import TableLoader from "@/components/Loaders/TableLoader";

export default function RoleRequestsPage() {
  const {
    data,
    loading,
    error,
    page,
    setPage,
    totalCount,
    fetchRoleRequests,
  } = useRoleRequests();

  if (loading) return <TableLoader />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <DataTable
        title="Role Requests"
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalCount={totalCount}
        refreshData={() => fetchRoleRequests(page)}        
      />
    </div>
  );
}
