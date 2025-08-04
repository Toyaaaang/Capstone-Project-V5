import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

type ApprovalHistory = {
  id: string;
  user_username: string; 
  requested_role: string;
  status: string; 
  processed_by_username: string; 
  processed_at: string; 
  idImageUrl?: string;
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
  {
    id: "id_card",
    header: "ID card",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">
              <ImageIcon className="mr-2 h-4 w-4" /> View
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Here&apos;s more info about <strong>{capitalize(user.user_username)}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <div><strong>Role:</strong> {capitalize(user.requested_role)}</div>
              <div><strong>Status:</strong> {capitalize(user.status)}</div>
              <div><strong>Processed By:</strong> {capitalize(user.processed_by_username)}</div>
              {user.idImageUrl ? (
                <img
                  src={user.idImageUrl}
                  alt="ID Image"
                  className="w-full rounded-lg border mt-3"
                />
              ) : (
                <div className="text-muted-foreground">No ID image uploaded</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];