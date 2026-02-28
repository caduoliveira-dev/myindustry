import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import type { Product } from "@/types/Product";
import type { RawMaterial } from "@/types/RawMaterial";
import type { ProductRawMaterial } from "@/types/ProductRawMaterial";
import type { PageResponse } from "@/types/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/api";

export function ProductDetailPage() {
  const { productId } = useParams({ from: "/products/$productId" });
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [associated, setAssociated] = useState<ProductRawMaterial[]>([]);
  const [allMaterials, setAllMaterials] = useState<RawMaterial[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [rmFilter, setRmFilter] = useState("");
  const [rmPageIndex, setRmPageIndex] = useState(0);
  const [rmPageCount, setRmPageCount] = useState(0);
  const RM_PAGE_SIZE = 10;

  function fetchRawMaterials(pageIndex: number, name: string) {
    const params = new URLSearchParams({
      page: String(pageIndex),
      size: String(RM_PAGE_SIZE),
    });
    if (name) params.set("name", name);
    fetch(`${API_URL}/raw-materials?${params}`)
      .then((res) => res.json())
      .then((result: PageResponse<RawMaterial>) => {
        setAllMaterials(result.content);
        setRmPageCount(result.totalPages);
      });
  }

  useEffect(() => {
    fetch(`${API_URL}/products/${productId}`)
      .then((res) => res.json())
      .then(setProduct);

    fetch(`${API_URL}/products/${productId}/raw-materials`)
      .then((res) => res.json())
      .then(setAssociated);
  }, [productId]);

  // Fetch on page change
  useEffect(() => {
    fetchRawMaterials(rmPageIndex, rmFilter);
  }, [rmPageIndex]);

  // Debounce filter: reset to page 0 and fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (rmPageIndex === 0) {
        fetchRawMaterials(0, rmFilter);
      } else {
        setRmPageIndex(0);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [rmFilter]);

  const associatedIds = new Set(associated.map((a) => a.rawMaterial.id));
  const unassociated = allMaterials.filter((m) => !associatedIds.has(m.id));

  async function handleAssociate(rawMaterialId: string) {
    const requiredQuantity = quantities[rawMaterialId] ?? 1;
    const res = await fetch(
      `${API_URL}/products/${productId}/raw-materials`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawMaterialId, requiredQuantity }),
      },
    );
    const created: ProductRawMaterial = await res.json();
    setAssociated((prev) => [...prev, created]);
    setQuantities((prev) => ({ ...prev, [rawMaterialId]: 1 }));
  }

  async function handleRemove(rawMaterialId: string) {
    await fetch(
      `${API_URL}/products/${productId}/raw-materials/${rawMaterialId}`,
      {
        method: "DELETE",
      },
    );
    setAssociated((prev) =>
      prev.filter((a) => a.rawMaterial.id !== rawMaterialId),
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen p-4">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/" })}
          >
            ← Back
          </Button>
          <div>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-muted-foreground">
              Price: ${product.price}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-sm">Associated</h3>
            <div className="rounded-md border overflow-hidden">
              {associated.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">
                  No materials associated.
                </p>
              ) : (
                associated.map((item) => (
                  <div
                    key={item.rawMaterial.id}
                    className="flex items-center justify-between px-4 py-2 border-b last:border-0 text-sm"
                  >
                    <div>
                      <span className="font-medium">
                        {item.rawMaterial.name}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        - {item.requiredQuantity}
                      </span>
                    </div>
                    <Button
                      data-testid="btn-remove"
                      size="sm"
                      onClick={() => handleRemove(item.rawMaterial.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-sm">Raw Materials</h3>
            <Input
              id="filterName"
              placeholder="Filter name..."
              value={rmFilter}
              onChange={(e) => setRmFilter(e.target.value)}
              className="max-w-xs"
            />
            <div className="rounded-md border overflow-hidden">
              {unassociated.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">
                  No materials found.
                </p>
              ) : (
                unassociated.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between px-4 py-2 border-b last:border-0 text-sm"
                  >
                    <span className="font-medium">{m.name}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={quantities[m.id] ?? 1}
                        onChange={(e) =>
                          setQuantities((prev) => ({
                            ...prev,
                            [m.id]: Number(e.target.value),
                          }))
                        }
                        className="border rounded-md px-2 py-1 text-sm w-16 text-center"
                      />
                      <Button
                        data-testid="btn-associate"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAssociate(m.id)}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-sm text-muted-foreground">
                Page {rmPageIndex + 1} of {rmPageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRmPageIndex((p) => p - 1)}
                disabled={rmPageIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRmPageIndex((p) => p + 1)}
                disabled={rmPageIndex >= rmPageCount - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
