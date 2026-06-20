import { SupplierDto } from "@/types";
import {
  useSuppliers,
  useUpdateSupplier,
} from "../../hooks/useSuppliers";
import { useToast } from "@/hooks/use-toast";

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Column, DataTable } from "@/ui/data-table";
import DeleteSupplierDialog from "./DeleteSupplierDialog";
import CreateEditSupplierForm from "./CreateEditSupplierForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { CardContent } from "@/ui/card";
import { Pagination } from "@/ui/pagination";

export default function SuppliersTable() {
  const [searchParams] = useSearchParams();

  const [editingSupplier, setEditingSupplier] = useState<SupplierDto | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<SupplierDto | null>(null);

  const { toast } = useToast();
  const { mutateAsync: updateSupplier, isPending: isUpdating } = useUpdateSupplier();

  const filters = {
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "10"),
    search: searchParams.get("search") ?? undefined,
  };

  const {
    data: suppliersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useSuppliers(filters);

  const columns: Column<SupplierDto>[] = [
    {
      key: "name",
      header: "اسم المورد",
      render: (s) => (
        <span className="font-semibold text-foreground flex items-center gap-2">
          {s.name}
        </span>
      ),
    },
    {
      key: "phoneNumber",
      header: "رقم الهاتف",
      className: "text-muted-foreground",
      render: (s) => s.phoneNumber || "-",
    },
    {
      key: "address",
      header: "العنوان",
      className: "text-muted-foreground",
      render: (s) => s.address || "-",
    },
    {
      key: "actions",
      header: "الإجراءات",
      headerClassName: "text-center",
      className: "text-center",
      render: (s) => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-8 w-8 shrink-0"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setEditingSupplier(s);
              }}
            >
              <Edit2 /> تعديل المورد
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setSupplierToDelete(s);
              }}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> حذف المورد
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <CardContent className="pt-6">
      <DataTable<SupplierDto>
        columns={columns}
        data={suppliersData?.suppliers || []}
        keyExtractor={(s) => s.supplierId}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyMessage="لم يتم العثور على الموردين. حاول إضافة موردين جدد."
        emptySearchMessage="لا توجد نتائج مطابقة لبحثك"
      />

      {
        <Pagination
          limit={suppliersData?.pagination.limit}
          total={suppliersData?.pagination.total}
        />
      }

      <Dialog
        open={!!editingSupplier}
        onOpenChange={(open) => {
          if (!open) setEditingSupplier(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المورد</DialogTitle>
          </DialogHeader>
          {editingSupplier && (
            <CreateEditSupplierForm
              onSubmit={async (data) => {
                try {
                  await updateSupplier({
                    id: editingSupplier.supplierId,
                    data,
                  });
                  toast({
                    title: "تم تحديث المورد",
                    description: "تم تحديث المورد بنجاح.",
                    variant: "success",
                  });
                  setEditingSupplier(null);
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "فشل تحديث المورد",
                    description:
                      error instanceof Error
                        ? error.message
                        : "حدث خطأ غير متوقع.",
                  });
                }
              }}
              supplierToEdit={editingSupplier}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteSupplierDialog
        supplier={supplierToDelete}
        open={!!supplierToDelete}
        onOpenChange={(open) => {
          if (!open) setSupplierToDelete(null);
        }}
      />
    </CardContent>
  );
}
