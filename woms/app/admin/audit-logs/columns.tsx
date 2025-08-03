import { ColumnDef } from "@tanstack/react-table";

export type AuditLog = {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  user?: {
    username: string | undefined;
    id: string;
    name?: string;
    email?: string;
  };
};

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user;
      return user
        ? `${user.username || user.email || user.id}`
        : "System";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ getValue }) =>
      new Date(getValue() as string).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];