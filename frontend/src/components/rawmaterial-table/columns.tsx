import type { ColumnDef } from "@tanstack/react-table";
import type { RawMaterial } from "@/types/RawMaterial";

export const columns: ColumnDef<RawMaterial>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "stockQuantity",
    header: "Stock Quantity",
  },
];
