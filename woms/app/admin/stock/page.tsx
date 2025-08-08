"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import StockChartSection from "./StockChartSection"
import StockTableSection from "./StockTableSection"

export default function StockPage() {
  const [view, setView] = useState("chart")

  return (
    <div className="p-6 space-y-4 h-screen flex flex-col"> {/* Add h-screen and flex-col */}
      <div className="flex items-center justify-between">
        <Select defaultValue="chart" onValueChange={setView}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chart">Bar Chart</SelectItem>
            <SelectItem value="table">Table</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-h-0 flex flex-col"> {/* Add this wrapper */}
        {view === "chart" ? <StockChartSection /> : <StockTableSection />}
      </div>
    </div>
  )
}
