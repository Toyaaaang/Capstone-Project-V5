"use client";

import { useRouter } from "next/navigation";
import { useMaterialRequests } from "@/hooks/employee/useMaterialRequests";
import { columns } from "./columns";
import DataTable from "@/components/Tables/DataTable";
import { Button } from "@/components/ui/button";
import TableLoader from "@/components/Loaders/TableLoader";

export default function MaterialRequestHistoryPage() {
  const router = useRouter();

  // Updated destructure from hook
  const {
    data,
    isLoading,
    refetch,
    page,
    setPage,
    totalCount,
  } = useMaterialRequests();

  return (
    <div className="p-4 space-y-4" >
      {isLoading ? (
        <TableLoader />
      ) : (
        <DataTable
          title="Requests History"
          columns={columns}
          data={data}
          refreshData={refetch}
          page={page}
          setPage={setPage}
          totalCount={totalCount}
          pageSize={8}
        />
      )}

      <div className="flex justify-between items-center">
        <Button onClick={() => router.push("/pages/employee/requests/")}>
          + New Request
        </Button>
      </div>
    </div>
  );
}
