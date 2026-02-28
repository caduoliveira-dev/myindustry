import { createContext, useContext } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { RawMaterial } from "@/types/RawMaterial";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const RawMaterialActionsContext = createContext<{
  onUpdate: (rawmaterial: RawMaterial) => void
  onDelete: (rawmaterial: RawMaterial) => void
}>({ onUpdate: () => {}, onDelete: () => {} });

export const columns: ColumnDef<RawMaterial>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "stockQuantity",
    header: "Stock Quantity",
  },
    {
      id: "actions",
      cell: ({ row }) => {
        const rawmaterial = row.original
        const { onUpdate, onDelete } = useContext(RawMaterialActionsContext)
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button data-testid="actions-trigger" variant="secondary" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem data-testid="action-update" onClick={() => onUpdate(rawmaterial)}>Update</DropdownMenuItem>
              <DropdownMenuItem data-testid="action-delete" variant="destructive" onClick={() => onDelete(rawmaterial)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
];
