import { createContext, useContext } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/types/Product";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ProductActionsContext = createContext<{
  onView: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onDelete: (product: Product) => void;
}>({ onView: () => {}, onUpdate: () => {}, onDelete: () => {} });

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <span>$ {row.getValue("price")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const { onView, onUpdate, onDelete } = useContext(ProductActionsContext);

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
            <DropdownMenuItem data-testid="action-view" onClick={() => onView(product)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="action-update" onClick={() => onUpdate(product)}>
              Update
            </DropdownMenuItem>
            <DropdownMenuItem
              data-testid="action-delete"
              variant="destructive"
              onClick={() => onDelete(product)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
