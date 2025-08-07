"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import DataTable from "@/components/Tables/DataTable";
import { useAdminInventory } from "@/hooks/admin/useAdminInventory";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function BatchAddInventoryPage() {
  const router = useRouter();
  const { materials, addInventory, inventory } = useAdminInventory();

  const [form, setForm] = useState({
    material: "",
    materialName: "",
    quantity: 0,
    visible: true,
  });

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const existingMaterialIds = inventory.map((inv: any) => inv.materialId);

  const handleChange = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleAddToList = () => {
    if (!form.material || !form.quantity) {
      toast.warning("Please select a material and enter quantity.");
      return;
    }
    if (existingMaterialIds.includes(form.material)) {
      toast.warning("This material is already in inventory.");
      return;
    }
    if (items.some(item => item.material === form.material)) {
      toast.warning("This material is already in the list.");
      return;
    }
    setItems([...items, { ...form }]);
    setForm({ material: "", materialName: "", quantity: 0, visible: true });
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      for (const item of items) {
        await addInventory({
          materialId: item.material,
          quantity: item.quantity,
        });
      }
      toast.success("All items added to inventory!");
      router.push("/admin/inventory"); // <-- go to inventory page, not API route
    } catch (err: any) {
      toast.error("Failed to add some items. Try again later.");
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Material", accessorKey: "materialName" },
    { header: "Quantity", accessorKey: "quantity" },
    {
      header: "Visible",
      accessorKey: "visible",
      cell: ({ row }: any) => (row.original.visible ? "Yes" : "No"),
    },
    {
      header: "",
      id: "actions",
      cell: ({ row }: any) => (
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={() => handleRemoveItem(row.index)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Batch Add Inventory</h1>
      <div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Add Material Form in a Card */}
          <div className="flex-1 min-w-[260px]">
            <Card>
              <CardHeader>
                <CardTitle>Add Material</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Material Selector via Combobox */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="material">Material</Label>
                  <Combobox
                    options={materials.map((mat: any) => ({
                      label: mat.name,
                      value: mat.id.toString(),
                    }))}
                    value={form.material}
                    onChange={(value) => {
                      const mat = materials.find((m: any) => m.id.toString() === value);
                      handleChange("material", value);
                      handleChange("materialName", mat?.name ?? "");
                    }}
                    placeholder="Select a material..."
                  />
                </div>
                {/* Quantity & Visibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Quantity"
                      value={form.quantity}
                      onChange={e => handleChange("quantity", Number(e.target.value))}
                    />

                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="visible">Visible</Label>
                    <div className="flex items-center gap-2 h-10">
                      <Checkbox
                        id="visible"
                        checked={form.visible}
                        onCheckedChange={val =>
                          handleChange("visible", !!val)
                        }
                      />
                      <span className="text-sm">Visible</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  type="button"
                  onClick={handleAddToList}
                  className="w-full"
                >
                  Add to List
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right: Preview Table & Submit */}
          <div className="flex-1 min-w-[320px]">
            <DataTable
              title="Items to Add"
              columns={columns}
              data={items}
              page={1}
              setPage={() => {}}
              totalCount={items.length}
              pageSize={items.length}
            />
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <div className="flex flex-col gap-4 mt-5 w-full">
              <Button
                type="button"
                disabled={loading || items.length === 0}
                onClick={handleSubmit}
                className="w-full"
              >
                {loading ? "Saving..." : "Add All"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/inventory")}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
