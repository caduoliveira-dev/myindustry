import { useEffect, useState } from "react";
import { columns, RawMaterialActionsContext } from "./columns";
import type { RawMaterial } from "@/types/RawMaterial";
import { DataTable } from "./data-table";
import { UpdateRawMaterialDialog } from "./update-rawmaterial-dialog";
import { DeleteRawMaterialDialog } from "./delete-rawmaterial-dialog";

export default function RawMaterialPage() {
  const [data, setData] = useState<RawMaterial[]>([]);
  const [editingRawMaterial, setEditingRawMaterial] = useState<RawMaterial | null>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [deletingRawMaterial, setDeletingRawMaterial] = useState<RawMaterial | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/raw-materials")
      .then((res) => res.json())
      .then((result) => setData(result));
  }, []);

    function handleUpdateSuccess(updated: RawMaterial) {
      setData((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  
    function handleDeleteSuccess(id: string) {
      setData((prev) => prev.filter((p) => p.id !== id));
    }

  return (
    <RawMaterialActionsContext.Provider
      value={{
        onUpdate: (rawmaterial) => {
          setEditingRawMaterial(rawmaterial);
          setUpdateDialogOpen(true);
        },
        onDelete: (rawmaterial) => {
          setDeletingRawMaterial(rawmaterial);
          setDeleteDialogOpen(true);
        },
      }}
    >
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
        <UpdateRawMaterialDialog
          rawmaterial={editingRawMaterial}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          onSuccess={handleUpdateSuccess}
        />
        <DeleteRawMaterialDialog
          rawmaterial={deletingRawMaterial}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onSuccess={handleDeleteSuccess}
        />
      </div>
    </RawMaterialActionsContext.Provider>
  );
}
