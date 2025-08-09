"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PrintableChargeForm from "@/components/forms/PrintableChargeForm";

export default function PrintablePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/requests/charge-tickets/${id}/printable/`)
      .then(res => res.json())
      .then(resData => setData(resData));
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return <PrintableChargeForm data={data} />;
}