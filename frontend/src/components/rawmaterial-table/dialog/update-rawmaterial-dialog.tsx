import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { RawMaterial } from "@/types/RawMaterial"
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
  stockQuantity: z.number().nonnegative("Price must be positive"),
})

type FormData = z.infer<typeof schema>

interface UpdateRawMaterialDialogProps {
  rawmaterial: RawMaterial | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (updated: RawMaterial) => void
}

export function UpdateRawMaterialDialog({
  rawmaterial,
  open,
  onOpenChange,
  onSuccess,
}: UpdateRawMaterialDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (rawmaterial) {
      reset({ name: rawmaterial.name, stockQuantity: rawmaterial.stockQuantity })
    }
  }, [rawmaterial, reset])

  async function onSubmit(data: FormData) {
    const res = await fetch(`http://localhost:3000/raw-materials/${rawmaterial!.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const updated: RawMaterial = await res.json()
    onSuccess(updated)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Raw Material</DialogTitle>
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
            <label htmlFor="stockQuantity" className="text-sm font-medium">
              Stock
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("stockQuantity", {valueAsNumber: true})}
              className="border rounded-md px-3 py-2 text-sm"
            />
            {errors.stockQuantity && (
              <span className="text-destructive text-xs">{errors.stockQuantity.message}</span>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
