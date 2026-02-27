import { useEffect, useState } from "react";
import { columns, ProductActionsContext } from "./columns";
import type { Product } from "@/types/Product";
import { DataTable } from "./data-table";
import { UpdateProductDialog } from "./update-product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";
import { CreateProductDialog } from "./create-product-dialog";
import { Button } from "@/components/ui/button";

export default function ProductPage() {
  const [data, setData] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((result) => setData(result));
  }, []);

  function handleUpdateSuccess(updated: Product) {
    setData((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleDeleteSuccess(id: string) {
    setData((prev) => prev.filter((p) => p.id !== id));
  }

  function handleCreateSuccess(created: Product) {
    setData((prev) => [...prev, created]);
  }

  return (
    <ProductActionsContext.Provider
      value={{
        onUpdate: (product) => {
          setEditingProduct(product);
          setUpdateDialogOpen(true);
        },
        onDelete: (product) => {
          setDeletingProduct(product);
          setDeleteDialogOpen(true);
        },
      }}
    >
      <div className="container mx-auto">
        <div className="flex justify-start mb-2">
          <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>Add Product</Button>
        </div>
        <DataTable columns={columns} data={data} />
        <UpdateProductDialog
          product={editingProduct}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          onSuccess={handleUpdateSuccess}
        />
        <DeleteProductDialog
          product={deletingProduct}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onSuccess={handleDeleteSuccess}
        />
        <CreateProductDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </ProductActionsContext.Provider>
  );
}
