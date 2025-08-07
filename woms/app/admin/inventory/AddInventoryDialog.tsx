"use client";

import { useState } from "react";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";

export default function AddInventoryDialog({
  materials,
  onAdd,
  onSuccess,
}: {
  materials: any[];
  onAdd: (item: any) => Promise<void>;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    material: "",
    materialName: "",
    quantity: 0,
    visible: true,
    unit: "pcs",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd({
        materialId: form.material, 
        quantity: form.quantity,
      });
      toast.success("Inventory added successfully.");
      setOpen(false);
      onSuccess?.();
      setForm({ material: "", materialName: "", quantity: 0, visible: true, unit: "" });
    } catch (err: any) {
      toast.error("Failed to add inventory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button className="mb-4">+ Add Inventory</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="mb-4">Add Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1 mb-4">
            <Label htmlFor="material">Material</Label>
            <Combobox
              options={materials.map(mat => ({
                value: mat.id.toString(),
                label: mat.name,
              }))}
              value={form.material ? form.material.toString() : ""}
              onChange={val => {
                const mat = materials.find(m => m.id.toString() === val);
                handleChange("material", val);
                handleChange("materialName", mat?.name ?? "");
                handleChange("unit", mat?.unit ?? "");
              }}
              placeholder="Select material..."
              searchPlaceholder="Search material..."
              className="w-[280px]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="flex flex-col gap-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                placeholder="Quantity"
                value={form.quantity}
                onChange={e => handleChange("quantity", Number(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="visible">Visible</Label>
              <div className="flex items-center gap-2 h-10">
                <Checkbox
                  id="visible"
                  checked={form.visible}
                  onCheckedChange={val => handleChange("visible", !!val)}
                />
                <span className="text-sm">Visible</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={form.unit}
              disabled
              readOnly
              className="bg-muted cursor-not-allowed"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading || !form.material || !form.quantity}
              className="w-full"
            >
              {loading ? "Saving..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
