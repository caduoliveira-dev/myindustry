export type ProductRawMaterial = {
  id: { productId: string; rawMaterialId: string }
  rawMaterial: { id: string; name: string; stockQuantity: number }
  requiredQuantity: number
}
