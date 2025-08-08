"use client";

import React, { useState } from "react";
import DataTable from "@/components/Tables/DataTable";
import { useAdminInventory } from "@/hooks/admin/useAdminInventory";
import { getInventoryColumns } from "./columns";
import TableLoader from "@/components/Loaders/TableLoader";
import AddInventoryDialog from "./AddInventoryDialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchAndFilter } from "@/components/ui/SearchAndFilter";
import { toast } from "sonner";

export default function AdminInventoryPage() {
  const {
    inventory,
    materials,
    loading,
    error,
    updateInventory,
    addInventory,
    fetchInventory,
  } = useAdminInventory();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [localInventory, setLocalInventory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const router = useRouter();

  // Only update localInventory from inventory when not editing
  React.useEffect(() => {
    if (editingId === null) {
      setLocalInventory(inventory);
    }
  }, [inventory, editingId]);

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 600);
    return () => clearTimeout(handler);
  }, [search]);

  // Filtered inventory based on search and category
  const filteredInventory = React.useMemo(() => {
    let result = localInventory;
    if (debouncedSearch) {
      result = result.filter((item) =>
        item.material?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    if (category !== "all") {
      result = result.filter((item) => item.material?.category === category);
    }
    return result;
  }, [localInventory, debouncedSearch, category]);

  const handleEdit = (id: number) => setEditingId(id);

  const handleChange = (id: number, field: string, value: any) => {
    setLocalInventory((inv) =>
      inv.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleSave = async (id: string) => {
    const item = localInventory.find((i) => i.id === id);
    if (item) {
      // If item.material is an object, use its id; if it's already a string, use as is
      const materialId =
        typeof item.material === "object" && item.material !== null
          ? item.material.id
          : item.material;

      await updateInventory(id, {
        materialId,
        quantity: Number(item.quantity),
      });
      setEditingId(null);
      toast.success("The inventory item was successfully updated.");
    }
  };

  const handleCancel = () => {
    setLocalInventory(inventory);
    setEditingId(null);
  };

  const handleAdd = async (item: any) => {
    await addInventory(item);
  };

  const columns = getInventoryColumns({
    onEdit: handleEdit,
    editingId,
    onChange: handleChange,
    onSave: handleSave,
    onCancel: handleCancel,
    materials,
  });

  return (
    <div>
      <div className="flex gap-2 mb-2 ml-5 select-none">
        <AddInventoryDialog
          materials={materials}
          onAdd={handleAdd}
          onSuccess={fetchInventory}
        />
        <Button
          variant="outline"
          onClick={() => router.push("/admin/inventory/batch-add")}
        >
          + Batch Add Inventory
        </Button>
      </div>
      {loading ? (
        <TableLoader />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <DataTable
          title="Inventory"
          columns={columns}
          data={filteredInventory}
          page={1}
          setPage={() => {}}
          totalCount={filteredInventory.length}
          pageSize={filteredInventory.length}
          filters={
            <SearchAndFilter
              searchPlaceholder="Search material..."
              searchValue={search}
              onSearchChange={setSearch}
            />
          }
        />
      )}
    </div>
  );
}