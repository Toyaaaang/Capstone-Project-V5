"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface EditNameDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  initialFirstName: string;
  initialLastName: string;
  refresh?: () => void; // optional callback
}

export default function EditNameDialog({
  open,
  onOpenChange,
  initialFirstName,
  initialLastName,
  refresh,
}: EditNameDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFirstName(""); // always empty to start
      setLastName("");
    }
  }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName || initialFirstName,
          last_name: lastName || initialLastName,
        }),
      });

      let json;
      try {
        json = await res.json();
      } catch {
        json = { error: "Invalid JSON response" };
      }

      if (!res.ok) throw new Error(json.error || "Failed");

      toast.success(json.message || "Name updated successfully");
      onOpenChange(false);
      refresh?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Your Name</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder={`${initialFirstName} (First Name)`}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            placeholder={`${initialLastName} (Last Name)`}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            <Save />
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}