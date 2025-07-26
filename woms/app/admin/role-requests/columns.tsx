import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";
import { useRoleRequests } from "@/hooks/admin/useRoleRequests";

type RoleRequest = {
  id: string;
  requestedRole: string;
  status: string;
  processedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isRoleConfirmed: boolean;
    department?: string | null;
    suboffice?: string | null;
    idImageUrl?: string | null;
  };
};

export const columns: ColumnDef<RoleRequest>[] = [
  
  {
    accessorKey: "user.firstName",
    header: "Name",
    cell: ({ row }) => {
      const { firstName, lastName } = row.original.user;
      const fullName = `${firstName} ${lastName}`;
      return <div className="py-2">{fullName}</div>;
    },
  },
  {
    accessorKey: "requestedRole",
    header: "Role",
    cell: ({ getValue }) => {
      const role = getValue() as string;
      return <span className="capitalize">{role.replace("_", " ")}</span>;
    },
  },
  {
    accessorKey: "processedAt",
    header: "Requested on",
    cell: ({ row }) => (
      <div className="py-2">
        {new Date(row.original.processedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    ),
  },
  {
    accessorKey: "user.isRoleConfirmed",
    header: "Status",
    cell: ({ row }) => (
      <Badge className="py-2 px-2">
        {row.original.user.isRoleConfirmed ? "Confirmed" : "Pending"}
      </Badge>
    ),
  },
  {
    id: "info",
    header: "ID card",
    cell: ({ row }) => {
      const user = row.original.user;

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
                Here's more info about <strong>{user.firstName} {user.lastName}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <div><strong>Role:</strong> {row.original.requestedRole}</div>
              {user.department && (
                <div>
                  <strong>Department:</strong> {user.department}
                </div>
              )}
              {user.suboffice && (
                <div>
                  <strong>Suboffice:</strong> {user.suboffice}
                </div>
              )}
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      
      const { approveRoleRequest, rejectRoleRequest } = useRoleRequests();

      return (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => approveRoleRequest(row.original.id)}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => rejectRoleRequest(row.original.id)}
          >
            Reject
          </Button>
        </div>
      );
    },
  },
];
