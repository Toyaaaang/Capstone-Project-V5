import { useEffect, useState } from "react";

export function useAdminInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/inventory", { credentials: "include" });
      const data = await res.json();
      setInventory(data.results ?? data);

      const matsRes = await fetch("/api/admin/materials/all", { credentials: "include" });
      const mats = await matsRes.json();
      setMaterials(mats);
    } catch (err: any) {
      setError("Failed to fetch inventory.");
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (id: number, data: any) => {
    try {
      await fetch(`/api/admin/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      await fetchInventory();
    } catch (err: any) {
      console.error("Update error:", err);
      throw err;
    }
  };

  const addInventory = async (data: any) => {
    try {
      await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      await fetchInventory();
    } catch (err: any) {
      console.error("Add error:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    materials,
    loading,
    error,
    fetchInventory,
    updateInventory,
    addInventory,
    setInventory,
  };
}
