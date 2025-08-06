"use client";

import React, { useState } from "react";
import DataTable from "@/components/Tables/DataTable";
import { useAdminMaterials } from "@/hooks/admin/useAdminMaterials";
import { getMaterialColumns } from "./columns";
import TableLoader from "@/components/Loaders/TableLoader";
import AddMaterialDialog from "./AddMaterialDialog";

export default function AdminMaterialsPage() {
  const {
    materials,
    loading,
    error,
    updateMaterial,
    setMaterials,
    page,
    setPage,
    totalCount,
    pageSize,
    fetchMaterials,
  } = useAdminMaterials();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [localMaterials, setLocalMaterials] = useState<any[]>([]);

  // Sync localMaterials with fetched materials
  React.useEffect(() => {
    setLocalMaterials(materials);
  }, [materials]);

  const handleEdit = (id: number) => setEditingId(id);

  const handleChange = (id: number, field: string, value: any) => {
    setLocalMaterials(mats =>
      mats.map(m => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSave = async (id: number) => {
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
  };

  const handleCancel = () => {
    setLocalMaterials(materials);
    setEditingId(null);
  };

  const columns = getMaterialColumns({
    onEdit: handleEdit,
    editingId,
    onChange: handleChange,
    onSave: handleSave,
    onCancel: handleCancel,
  });

  return (
    <div className="p-6">
      {loading ? (
        <TableLoader />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <DataTable
            title="Materials Management"
            columns={columns}
            data={localMaterials}
            page={page}
            setPage={setPage}
            totalCount={totalCount}
            pageSize={pageSize}
          />
          <AddMaterialDialog onMaterialAdded={fetchMaterials} />
        </>
      )}
    </div>
  );
}