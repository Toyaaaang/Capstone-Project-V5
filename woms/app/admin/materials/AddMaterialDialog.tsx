"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ConfirmActionDialog } from "@/components/alert-dialog/AlertDialog";
import { CATEGORY_OPTIONS } from "./columns";

export default function AddMaterialDialog({ onMaterialAdded }: { onMaterialAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    unit: "",
    category: "uncategorized",
    description: "",
    visible: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/materials/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add material.");
      setOpen(false);
      setForm({
        name: "",
        unit: "",
        category: "uncategorized",
        description: "",
        visible: true,
      });
      await onMaterialAdded();
    } catch (err: any) {
      setError("Failed to add material.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="m-4 select-none">+ New Material</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Material</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
          className="space-y-4"
        >
          <div>
            <Label className="p-2" htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Material name"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="p-2" htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              placeholder="Unit of measurement"
              value={form.unit}
              onChange={e => handleChange("unit", e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="p-2" htmlFor="category">Category</Label>
            <Select
              value={form.category}
              onValueChange={val => handleChange("category", val)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="p-2" htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Description of Material"
              value={form.description}
              onChange={e => handleChange("description", e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input className="m-3 h-4 w-4"
              type="checkbox"
              checked={form.visible}
              onChange={e => handleChange("visible", e.target.checked)}
              id="visible"
            />
            <Label className="m-3" htmlFor="visible">Visible</Label>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <DialogFooter>
            <ConfirmActionDialog
              trigger={
                <Button className="w-full" type="button" disabled={loading}>
                  {loading ? "Saving..." : "Add Material"}
                </Button>
              }
              title="Add Material"
              description="Are you sure you want to add this material?"
              confirmLabel="Add"
              cancelLabel="Cancel"
              onConfirm={handleSubmit}
              loading={loading}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}