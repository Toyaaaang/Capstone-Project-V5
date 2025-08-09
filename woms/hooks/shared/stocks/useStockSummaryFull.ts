import { useEffect, useState } from "react"

export interface StockSummary {
  name: string
  unit: string
  quantity: number | string
  category: string
}

export default function useStockSummary() {
  const [data, setData] = useState<StockSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSummary = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/inventory/summary-nopage/", {
        credentials: "include",
      })
      const resData = await res.json()
      setData(resData)
    } catch (err) {
      setError(err as Error)
      console.error("Chart fetch failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  return { data, isLoading, error, refetch: fetchSummary }
}
