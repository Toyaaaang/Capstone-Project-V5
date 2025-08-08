"use client";

import React, { useState } from "react";
import DataTable from "@/components/Tables/DataTable";
import { useAdminMaterials } from "@/hooks/admin/useAdminMaterials";
import { getMaterialColumns } from "./columns";
import TableLoader from "@/components/Loaders/TableLoader";
import AddMaterialDialog from "./AddMaterialDialog";
import { SearchAndFilter } from "@/components/ui/SearchAndFilter";

export default function AdminMaterialsPage() {
  const {
    materials,
    loading,
    updateMaterial,
    page,
    setPage,
    totalCount,
    pageSize,
    fetchMaterials,
    search,
    setSearch,
    category,
    setCategory,
  } = useAdminMaterials();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [localMaterials, setLocalMaterials] = useState<any[]>([]);

  React.useEffect(() => {
    setLocalMaterials(materials);
  }, [materials]);

  const columns = getMaterialColumns({
    onEdit: (id) => setEditingId(id),
    editingId,
    onChange: (id, field, value) =>
      setLocalMaterials(mats =>
        mats.map(m => (m.id === id ? { ...m, [field]: value } : m))
      ),
    onSave: async (id) => {
      const mat = localMaterials.find(m => m.id === id);
      if (mat) {
        await updateMaterial(id, {
          name: mat.name,
          unit: mat.unit,
          category: mat.category,
          visible: mat.visible,
        });
        setEditingId(null);
      }
    },
    onCancel: () => {
      setLocalMaterials(materials);
      setEditingId(null);
    },
  });

  // MaterialCategory options from your schema
  const categoryOptions = [
    { label: "All", value: "all" },
    { label: "Wiring", value: "wiring" },
    { label: "Poles", value: "poles" },
    { label: "Metering", value: "metering" },
    { label: "Transformers", value: "transformers" },
    { label: "Hardware", value: "hardware" },
    { label: "Safety", value: "safety" },
    { label: "Tools", value: "tools" },
    { label: "Office Supply", value: "office_supply" },
    { label: "Uncategorized", value: "uncategorized" },
  ];

  // Use "all" as no filter
  const selectedCategory = category === "all" ? "" : category;

  // Fetch materials when filters change
  React.useEffect(() => {
    fetchMaterials(page, search, selectedCategory);
    // eslint-disable-next-line
  }, [page, search, category]);

  return (
    <div className="p-6">
      {loading ? (
        <TableLoader />
      ) : (
        <DataTable
          title="Materials Management"
          columns={columns}
          data={localMaterials}
          page={page}
          setPage={setPage}
          totalCount={totalCount}
          pageSize={pageSize}
          filters={
            <SearchAndFilter
              searchPlaceholder="Search materials..."
              searchValue={search}
              onSearchChange={setSearch}
              dropdowns={[
                {
                  label: "Category",
                  value: category,
                  options: categoryOptions,
                  onChange: setCategory,
                },
              ]}
            />
          }
        />
      )}
      <AddMaterialDialog onMaterialAdded={fetchMaterials} />
    </div>
  );
}