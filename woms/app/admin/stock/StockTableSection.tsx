import useStockSummary from "@/hooks/shared/stocks/useStockSummary"
import DataTable from "@/components/Tables/DataTable"
import { Skeleton } from "@/components/ui/skeleton"
import { stockColumns } from "./columns"
import { useState } from "react"

export default function StockTableSection() {
  const [page, setPage] = useState(1)
  const { data, totalCount, isLoading } = useStockSummary(page)

  if (isLoading) return <Skeleton className="h-[350px] w-full" />

  return (
    <DataTable
      title="Stock Summary"
      data={data}
      columns={stockColumns}
      page={page}
      setPage={setPage}
      totalCount={totalCount}
      pageSize={10}
    />
  )
}
