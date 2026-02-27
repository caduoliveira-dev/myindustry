import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Product } from "@/types/Product"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive"),
})

type FormData = z.infer<typeof schema>

interface CreateProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (created: Product) => void
}

export function CreateProductDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateProductDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    const res = await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const created: Product = await res.json()
    onSuccess(created)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              {...register("name")}
              className="border rounded-md px-3 py-2 text-sm"
            />
            {errors.name && (
              <span className="text-destructive text-xs">{errors.name.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="price" className="text-sm font-medium">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="border rounded-md px-3 py-2 text-sm"
            />
            {errors.price && (
              <span className="text-destructive text-xs">{errors.price.message}</span>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="secondary" type="submit" disabled={isSubmitting}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
