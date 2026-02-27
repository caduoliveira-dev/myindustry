import { useEffect, useState } from "react";
import { columns, RawMaterialActionsContext } from "./columns";
import type { RawMaterial } from "@/types/RawMaterial";
import type { PageResponse } from "@/types/Page";
import { DataTable } from "./data-table";
import { UpdateRawMaterialDialog } from "./update-rawmaterial-dialog";
import { DeleteRawMaterialDialog } from "./delete-rawmaterial-dialog";
import { CreateRawMaterialDialog } from "./create-rawmaterial-dialog";
import { Button } from "@/components/ui/button";
import type { PaginationState } from "@tanstack/react-table";

export default function RawMaterialPage() {
  const [data, setData] = useState<RawMaterial[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [editingRawMaterial, setEditingRawMaterial] =
    useState<RawMaterial | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deletingRawMaterial, setDeletingRawMaterial] =
    useState<RawMaterial | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  function fetchPage(pageIndex: number, pageSize: number) {
    fetch(
      `http://localhost:3000/raw-materials?page=${pageIndex}&size=${pageSize}`,
    )
      .then((res) => res.json())
      .then((result: PageResponse<RawMaterial>) => {
        setData(result.content);
        setPageCount(result.totalPages);
      });
  }

  useEffect(() => {
    fetchPage(pagination.pageIndex, pagination.pageSize);
  }, [pagination]);

  function handleUpdateSuccess(updated: RawMaterial) {
    setData((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleDeleteSuccess() {
    fetchPage(pagination.pageIndex, pagination.pageSize);
  }

  function handleCreateSuccess() {
    fetchPage(pagination.pageIndex, pagination.pageSize);
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
        <div className="flex justify-start mb-2">
          <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
            Add Raw Material
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={data}
          pageCount={pageCount}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
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
        <CreateRawMaterialDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </RawMaterialActionsContext.Provider>
  );
}
