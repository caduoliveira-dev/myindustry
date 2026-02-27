import { useEffect, useState } from "react"
import { useParams, useNavigate } from "@tanstack/react-router"
import type { Product } from "@/types/Product"
import type { RawMaterial } from "@/types/RawMaterial"
import type { ProductRawMaterial } from "@/types/ProductRawMaterial"
import { Button } from "@/components/ui/button"

export function ProductDetailPage() {
  const { productId } = useParams({ from: "/products/$productId" })
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [associated, setAssociated] = useState<ProductRawMaterial[]>([])
  const [allMaterials, setAllMaterials] = useState<RawMaterial[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch(`http://localhost:3000/products/${productId}`)
      .then((res) => res.json())
      .then(setProduct)

    fetch(`http://localhost:3000/products/${productId}/raw-materials`)
      .then((res) => res.json())
      .then(setAssociated)

    fetch("http://localhost:3000/raw-materials?size=1000")
      .then((res) => res.json())
      .then((result) => setAllMaterials(result.content))
  }, [productId])

  const associatedIds = new Set(associated.map((a) => a.rawMaterial.id))

  async function handleAssociate(rawMaterialId: string) {
    const requiredQuantity = quantities[rawMaterialId] ?? 1
    const res = await fetch(`http://localhost:3000/products/${productId}/raw-materials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawMaterialId, requiredQuantity }),
    })
    const created: ProductRawMaterial = await res.json()
    setAssociated((prev) => [...prev, created])
    setQuantities((prev) => ({ ...prev, [rawMaterialId]: 1 }))
  }

  async function handleRemove(rawMaterialId: string) {
    await fetch(`http://localhost:3000/products/${productId}/raw-materials/${rawMaterialId}`, {
      method: "DELETE",
    })
    setAssociated((prev) => prev.filter((a) => a.rawMaterial.id !== rawMaterialId))
  }

  const unassociated = allMaterials.filter((m) => !associatedIds.has(m.id))

  if (!product) return null

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="min-w-100 flex flex-col gap-4">
        <div className="flex items-center gap-4">          
          <div>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-muted-foreground">Price: ${product.price}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-sm">Associated Raw Materials</h3>
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
                      <span className="font-medium">{item.rawMaterial.name}</span>
                      <span className="text-muted-foreground ml-2">- {item.requiredQuantity}</span>
                    </div>
                    <Button size="sm" onClick={() => handleRemove(item.rawMaterial.id)}>
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-sm">Raw Materials</h3>
            <div className="rounded-md border overflow-hidden">
              {unassociated.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">
                  All materials already associated.
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
                          setQuantities((prev) => ({ ...prev, [m.id]: Number(e.target.value) }))
                        }
                        className="border rounded-md px-2 py-1 text-sm w-16 text-center"
                      />
                      <Button size="sm" onClick={() => handleAssociate(m.id)}>
                        Add
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div>          
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })}>
            ← Back
          </Button>
        </div>
      </div>
    </div>
  )
}
