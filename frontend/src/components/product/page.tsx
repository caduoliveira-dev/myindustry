import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { columns, ProductActionsContext } from "./table/columns";
import type { Product } from "@/types/Product";
import type { PageResponse } from "@/types/Page";
import type { ProductionSuggestion } from "@/types/ProductionSuggestion";
import { DataTable } from "./table/data-table";
import { UpdateProductDialog } from "./dialog/update-product-dialog";
import { DeleteProductDialog } from "./dialog/delete-product-dialog";
import { CreateProductDialog } from "./dialog/create-product-dialog";
import { Button } from "@/components/ui/button";
import type { PaginationState } from "@tanstack/react-table";
import { API_URL } from "@/lib/api";

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
  const [suggestion, setSuggestion] = useState<ProductionSuggestion | null>(
    null,
  );
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  function fetchPage(pageIndex: number, pageSize: number, name: string) {
    const params = new URLSearchParams({
      page: String(pageIndex),
      size: String(pageSize),
    });
    if (name) params.set("name", name);
    fetch(`${API_URL}/products?${params}`)
      .then((res) => res.json())
      .then((result: PageResponse<Product>) => {
        setData(result.content);
        setPageCount(result.totalPages);
      });
  }

  useEffect(() => {
    fetchPage(pagination.pageIndex, pagination.pageSize, nameFilter);
  }, [pagination]);

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

  function handleGenerateSuggestion() {
    setLoadingSuggestion(true);
    fetch(`${API_URL}/production/suggestion`)
      .then((res) => res.json())
      .then((result: ProductionSuggestion) => setSuggestion(result))
      .finally(() => setLoadingSuggestion(false));
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
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex-1 w-full">
            <div className="flex justify-start mb-2">
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(true)}
              >
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
          </div>

          <div className="w-full lg:w-72 lg:shrink-0 border rounded-md p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Production Suggestion</h3>
              <Button
                size="sm"
                onClick={handleGenerateSuggestion}
                disabled={loadingSuggestion}
              >
                {loadingSuggestion ? "Loading..." : "Generate"}
              </Button>
            </div>

            {suggestion === null ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Click Generate to see a suggestion.
              </p>
            ) : suggestion.items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No production possible with current stock.
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  {suggestion.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between text-sm py-1 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-muted-foreground text-xs">
                          {item.unitsToProduce}x · ${item.unitPrice.toFixed(2)}{" "}
                          each
                        </p>
                      </div>
                      <span className="font-medium">
                        ${item.totalValue.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-2">
                  <span>Grand Total</span>
                  <span>${suggestion.grandTotal.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>

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
