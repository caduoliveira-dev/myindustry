import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { columns, ProductActionsContext } from "./columns";
import type { Product } from "@/types/Product";
import type { PageResponse } from "@/types/Page";
import { DataTable } from "./data-table";
import { UpdateProductDialog } from "./update-product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";
import { CreateProductDialog } from "./create-product-dialog";
import { Button } from "@/components/ui/button";
import type { PaginationState } from "@tanstack/react-table";

export default function ProductPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Product[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  function fetchPage(pageIndex: number, pageSize: number) {
    fetch(`http://localhost:3000/products?page=${pageIndex}&size=${pageSize}`)
      .then((res) => res.json())
      .then((result: PageResponse<Product>) => {
        setData(result.content);
        setPageCount(result.totalPages);
      });
  }

  useEffect(() => {
    fetchPage(pagination.pageIndex, pagination.pageSize);
  }, [pagination]);

  function handleUpdateSuccess(updated: Product) {
    setData((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleDeleteSuccess() {
    fetchPage(pagination.pageIndex, pagination.pageSize);
  }

  function handleCreateSuccess() {
    fetchPage(pagination.pageIndex, pagination.pageSize);
  }

  return (
    <ProductActionsContext.Provider
      value={{
        onView: (product) =>
          navigate({
            to: "/products/$productId",
            params: { productId: product.id },
          }),
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
          <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
            Add Product
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={data}
          pageCount={pageCount}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
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
