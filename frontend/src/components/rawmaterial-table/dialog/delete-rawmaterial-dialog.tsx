import { useState } from "react"
import type { RawMaterial } from "@/types/RawMaterial"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteRawMaterialDialogProps {
  rawmaterial: RawMaterial | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (id: string) => void
}

export function DeleteRawMaterialDialog({
  rawmaterial,
  open,
  onOpenChange,
  onSuccess,
}: DeleteRawMaterialDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    await fetch(`http://localhost:3000/raw-materials/${rawmaterial!.id}`, {
      method: "DELETE",
    })
    onSuccess(rawmaterial!.id)
    setIsDeleting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Raw Material</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{rawmaterial?.name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="default" disabled={isDeleting} onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
