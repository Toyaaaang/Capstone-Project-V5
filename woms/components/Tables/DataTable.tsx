"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

// 👇 Define meta type for optional refreshData
type TableMeta = {
  refreshData?: () => void;
};

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  title: string;
  refreshData?: () => void;
  page: number;
  setPage: (page: number) => void;
  totalCount: number;
  pageSize?: number;
  /** Optional: Pass a custom filter component to render above the table */
  filters?: React.ReactNode;
  getRowId?: (row: TData) => string;
}

export default function DataTable<TData>({
  columns = [],
  data = [],
  title,
  refreshData,
  page,
  setPage,
  totalCount,
  pageSize = 10,
  filters,
  getRowId,
}: DataTableProps<TData>) {
  const totalPages = Math.ceil(totalCount / pageSize);

  const table = useReactTable<TData>({
    data,
    columns,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newPageIndex =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize }).pageIndex
          : updater.pageIndex;

      if (typeof setPage === "function") {
        setPage(newPageIndex + 1);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    ...(getRowId && { getRowId }),
    meta: {
      refreshData,
    },
  });

  return (
    <div
      className="p-4 border rounded-md shadow-sm select-none"
      style={{
        background: "rgba(0, 17, 252, 0.04)",
        boxShadow: "0 8px 38px 0 rgba(23,23,23,0.17)",
        backdropFilter: "blur(18.5px)",
        WebkitBackdropFilter: "blur(4.5px)",
      }}
    >
      {/* Title and Filters in a single row, no wrap */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-nowrap">
        <h2 className="text-xl font-bold p-4 m-0">{title}</h2>
        {filters && (
          <div className="flex items-center gap-2">{filters}</div>
        )}
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns?.length || 1} className="text-center">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={page <= 1}
          >
            <ArrowLeft className="mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={page >= totalPages}
          >
            Next
            <ArrowRight className="ml-2" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
      </div>
    </div>
  );
}
