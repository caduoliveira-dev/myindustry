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
  const [nameFilter, setNameFilter] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  function fetchPage(pageIndex: number, pageSize: number, name: string) {
    const params = new URLSearchParams({
      page: String(pageIndex),
      size: String(pageSize),
    });
    if (name) params.set("name", name);
    fetch(`http://localhost:3000/products?${params}`)
      .then((res) => res.json())
      .then((result: PageResponse<Product>) => {
        setData(result.content);
        setPageCount(result.totalPages);
      });
  }

  // Fetch on pagination change (captures current nameFilter from closure)
  useEffect(() => {
    fetchPage(pagination.pageIndex, pagination.pageSize, nameFilter);
  }, [pagination]);

  // Debounce filter: after 300ms, reset to page 0 and fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.pageIndex === 0) {
        fetchPage(0, pagination.pageSize, nameFilter);
      } else {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [nameFilter]);

  function handleUpdateSuccess(updated: Product) {
    setData((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleDeleteSuccess() {
    fetchPage(pagination.pageIndex, pagination.pageSize, nameFilter);
  }

  function handleCreateSuccess() {
    fetchPage(pagination.pageIndex, pagination.pageSize, nameFilter);
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
          nameFilter={nameFilter}
          onNameFilterChange={setNameFilter}
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
