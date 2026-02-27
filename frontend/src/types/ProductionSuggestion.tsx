export type ProductionItem = {
  productId: string
  productName: string
  unitPrice: number
  unitsToProduce: number
  totalValue: number
}

export type ProductionSuggestion = {
  items: ProductionItem[]
  grandTotal: number
}
