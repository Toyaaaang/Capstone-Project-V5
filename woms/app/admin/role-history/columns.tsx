import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

type ApprovalHistory = {
  id: string;
  user_username: string; 
  requested_role: string;
  status: string; 
  processed_by_username: string; 
  processed_at: string; 
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const columns: ColumnDef<ApprovalHistory>[] = [
  {
    accessorKey: "user_username",
    header: "User",
    cell: ({ row }) => (
      <div className="py-2">{capitalize(row.original.user_username)}</div>
    ),
  },
  {
    accessorKey: "requested_role",
    header: "Requested Role",
    cell: ({ row }) => (
      <div className="py-2">{capitalize(row.original.requested_role)}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "approved" ? "default" : "destructive"}
        className="py-1 px-2"
      >
        {capitalize(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: "processed_by_username",
    header: "Processed By",
    cell: ({ row }) => (
      <div className="py-2">{capitalize(row.original.processed_by_username)}</div>
    ),
  },
  {
    accessorKey: "processed_at",
    header: "Processed At",
    cell: ({ row }) => (
      <div className="py-2">
        {new Date(row.original.processed_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    ),
  },
];