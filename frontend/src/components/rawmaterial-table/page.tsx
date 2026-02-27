import { useEffect, useState } from "react";
import { columns } from "./columns";
import type { RawMaterial } from "@/types/RawMaterial";
import { DataTable } from "./data-table";

export default function RawMaterialPage() {
  const [data, setData] = useState<RawMaterial[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/raw-materials")
      .then((res) => res.json())
      .then((result) => setData(result));
  }, []);

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
