// app/pages/stock/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { StockSummary } from "@/hooks/shared/stocks/useStockSummary"
import { Badge } from "@/components/ui/badge"

export const stockColumns: ColumnDef<StockSummary>[] = [
  {
    accessorKey: "name",
    header: "Item Name",
    cell: ({ getValue }) => (
       <span className="font-semibold whitespace-nowrap px-2">{getValue() as string}</span>
    ),
    size: 220,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ getValue }) => (
      <span className="font-mono whitespace-nowrap px-2">{Number(getValue()).toLocaleString()}</span>
    ),
    size: 120,
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap px-2">{getValue() as string}</span>
    ),
    size: 100,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ getValue }) => {
      const category = getValue() as string
      const labels: Record<string, string> = {
        wiring: "WIRING AND CONDUCTORS",
        poles: "POLES AND SUPPORTS",
        metering: "METERING EQUIPMENT",
        transformers: "TRANSFORMERS & SUBSTATIONS",
        hardware: "HARDWARE & FASTENERS",
        safety: "SAFETY EQUIPMENT",
        tools: "TOOLS & ACCESSORIES",
        office_supply: "OFFICE SUPPLIES",
        uncategorized: "UNCATEGORIZED",
      }
      const badgeVariants: Record<string, "primary" | "secondary" | "info" | "warning" | "destructive" | "success" | "outline" | "default"> = {
        wiring: "primary",
        poles: "secondary",
        metering: "info",
        transformers: "warning",
        hardware: "destructive",
        safety: "success",
        tools: "outline",
        office_supply: "default",
        uncategorized: "secondary",
      }
      const variant = badgeVariants[category] || "secondary"
      return (
        <Badge variant={variant} className="whitespace-nowrap px-2">
          {labels[category] || (category ? category.replace(/_/g, " ").toUpperCase() : "—")}
        </Badge>
      )
    },
    size: 220,
  },
]
