import { useEffect, useState } from "react";

export function useAdminMaterials() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const pageSize = 10; // or whatever default you want

  // Fetch all materials
  const fetchMaterials = async (pageNumber = 1, searchValue = "", categoryValue = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(pageNumber),
        page_size: String(pageSize),
      });
      if (searchValue) params.append("search", searchValue);
      if (categoryValue) params.append("category", categoryValue);

      const res = await fetch(`/api/admin/materials?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setMaterials(data.results ?? data);
      setTotalCount(data.count ?? data.length ?? 0);
    } catch (err: any) {
      setError("Failed to fetch materials.");
    } finally {
      setLoading(false);
    }
  };

  // Update a material
  const updateMaterial = async (id: number, data: any) => {
    try {
      const res = await fetch(`/api/admin/materials/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update material.");
      await fetchMaterials(page);
    } catch (err) {
      setError("Failed to update material.");
    }
  };

  useEffect(() => {
    fetchMaterials(page, search, category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, category]);

  return {
    materials,
    loading,
    error,
    fetchMaterials,
    updateMaterial,
    setMaterials, // for local editing before save
    page,
    setPage,
    totalCount,
    pageSize,
    search,
    setSearch,
    category,
    setCategory,
  };
}