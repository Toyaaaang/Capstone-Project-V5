// hooks/shared/useStockSummaryPaginated.ts
import { useEffect, useState } from "react"

export interface StockSummary {
  name: string
  unit: string
  quantity: number | string
  category: string
}

export default function useStockSummaryPaginated(page = 1) {
  const [data, setData] = useState<StockSummary[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSummary = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/inventory/summary-full/?page=${page}`, {
        credentials: "include",
      })
      const resData = await res.json()
      if (resData.results) {
        setData(resData.results)
        setTotalCount(resData.count)
      } else {
        setData(resData)
        setTotalCount(resData.length)
      }
    } catch (error) {
      setError(error as Error)
      console.error("Failed to fetch paginated stock summary:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return { data, totalCount, isLoading, error, refetch: fetchSummary }
}
