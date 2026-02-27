import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/types/Product";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
];
