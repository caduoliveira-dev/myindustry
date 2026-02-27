import { useEffect, useState } from "react";
import { columns } from "./columns";
import type { Product } from "@/types/Product";
import { DataTable } from "./data-table";
import { Button } from "../ui/button";

export default function ProductPage() {
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((result) => setData(result));
  }, []);

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
