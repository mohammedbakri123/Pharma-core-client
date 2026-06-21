import type { CustomerDto } from "@/types";
import {
  useCustomers,
  useUpdateCustomer,
} from "../../hooks/useCustomers";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";
import { type Column, DataTable } from "@/ui/data-table";
import DeleteCustomerDialog from "./DeleteCustomerDialog";
import CreateEditCustomerForm from "./CreateEditCustomerForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";
import { Edit2, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { CardContent } from "@/ui/card";
import { Pagination } from "@/ui/pagination";

export default function CustomersTable() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [editingCustomer, setEditingCustomer] = useState<CustomerDto | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerDto | null>(null);

  const { toast } = useToast();
  const { mutateAsync: updateCustomer, isPending: isUpdating } = useUpdateCustomer();

  const filters = {
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "10"),
    search: searchParams.get("search") ?? undefined,
  };

  const {
    data: customersData,
    isLoading,
    isError,
    refetch,
  } = useCustomers(filters);

  const columns: Column<CustomerDto>[] = [
    {
      key: "name",
      header: "اسم العميل",
      render: (c) => (
        <span className="font-semibold text-foreground flex items-center gap-2">
          {c.name}
        </span>
      ),
    },
    {
      key: "phoneNumber",
      header: "رقم الهاتف",
      className: "text-muted-foreground",
      render: (c) => c.phoneNumber || "-",
    },
    {
      key: "address",
      header: "العنوان",
      className: "text-muted-foreground",
      render: (c) => c.address || "-",
    },
    {
      key: "note",
      header: "ملاحظة",
      className: "text-muted-foreground max-w-40 truncate",
      render: (c) => c.note || "-",
    },
    {
      key: "actions",
      header: "الإجراءات",
      headerClassName: "text-center",
      className: "text-center",
      render: (c) => (
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
              onSelect={() => {
                navigate(`/people/customer/${c.customerId}`);
              }}
            >
              <Eye className="w-4 h-4" /> عرض التفاصيل
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setEditingCustomer(c);
              }}
            >
              <Edit2 /> تعديل العميل
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setCustomerToDelete(c);
              }}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> حذف العميل
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <CardContent className="pt-6">
      <DataTable<CustomerDto>
        columns={columns}
        data={customersData?.customers || []}
        keyExtractor={(c) => c.customerId}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyMessage="لم يتم العثور على العملاء. حاول إضافة عملاء جدد."
        emptySearchMessage="لا توجد نتائج مطابقة لبحثك"
      />

      {
        <Pagination
          limit={customersData?.pagination.limit}
          total={customersData?.pagination.total}
        />
      }

      <Dialog
        open={!!editingCustomer}
        onOpenChange={(open) => {
          if (!open) setEditingCustomer(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل العميل</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <CreateEditCustomerForm
              onSubmit={async (data) => {
                try {
                  await updateCustomer({
                    id: editingCustomer.customerId,
                    data,
                  });
                  toast({
                    title: "تم تحديث العميل",
                    description: "تم تحديث العميل بنجاح.",
                    variant: "success",
                  });
                  setEditingCustomer(null);
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "فشل تحديث العميل",
                    description:
                      error instanceof Error
                        ? error.message
                        : "حدث خطأ غير متوقع.",
                  });
                }
              }}
              customerToEdit={editingCustomer}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteCustomerDialog
        customer={customerToDelete}
        open={!!customerToDelete}
        onOpenChange={(open) => {
          if (!open) setCustomerToDelete(null);
        }}
      />
    </CardContent>
  );
}
