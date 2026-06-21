import { ExpenseDto } from "@/types";
import {
  useExpenseList,
  useUpdateExpense,
} from "../../hooks/useExpenses";
import { useToast } from "@/hooks/use-toast";

import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Column, DataTable } from "@/ui/data-table";
import DeleteExpenseDialog from "./DeleteExpenseDialog";
import CreateExpenseForm from "./CreateExpenseForm";
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

export default function ExpensesTable() {
  const [searchParams] = useSearchParams();

  const [editingExpense, setEditingExpense] = useState<ExpenseDto | null>(
    null,
  );
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseDto | null>(
    null,
  );

  const { toast } = useToast();
  const { mutateAsync: updateExpense, isPending: isUpdating } =
    useUpdateExpense();

  const filters = {
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "10"),
  };

  const {
    data: Expenses,
    isLoading,
    isError,
    error,
    refetch,
  } = useExpenseList(filters);

  const columns: Column<ExpenseDto>[] = [
    {
      key: "amount",
      header: "المبلغ",
      render: (e) => (
        <span className="font-semibold text-foreground">
          {e.amount.toLocaleString()} ريال
        </span>
      ),
    },
    {
      key: "description",
      header: "البيان",
      render: (e) => (
        <span className="text-muted-foreground">
          {e.description || "-"}
        </span>
      ),
    },
    {
      key: "userName",
      header: "المستخدم",
      render: (e) => (
        <span className="text-muted-foreground">
          {e.userName || "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "التاريخ",
      render: (e) => (
        <span className="text-muted-foreground text-sm" dir="ltr">
          {e.createdAt
            ? new Date(e.createdAt).toLocaleDateString("ar-SA")
            : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      headerClassName: "text-center",
      className: "text-center",
      render: (e) => (
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
              onSelect={(ev) => {
                ev.preventDefault();
                setEditingExpense(e);
              }}
            >
              <Edit2 /> تعديل المصروف
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(ev) => {
                ev.preventDefault();
                setExpenseToDelete(e);
              }}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> حذف المصروف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <CardContent className="pt-6">
      <DataTable<ExpenseDto>
        columns={columns}
        data={Expenses?.expenses || []}
        keyExtractor={(e) => e.expenseId}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyMessage="لم يتم العثور على المصروفات. حاول إضافة مصروفات جديدة."
        emptySearchMessage="لا توجد نتائج مطابقة لبحثك"
      />

      {
        <Pagination
          limit={Expenses?.pagination.limit}
          total={Expenses?.pagination.total}
        />
      }
      <Dialog
        open={!!editingExpense}
        onOpenChange={(open) => {
          if (!open) setEditingExpense(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المصروف</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <CreateExpenseForm
              onSubmit={async (data) => {
                try {
                  await updateExpense({
                    id: editingExpense.expenseId,
                    data,
                  });
                  toast({
                    title: "تم تحديث المصروف",
                    description: "تم تحديث المصروف بنجاح.",
                    variant: "success",
                  });
                  setEditingExpense(null);
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "فشل تحديث المصروف",
                    description:
                      error instanceof Error
                        ? error.message
                        : "حدث خطأ غير متوقع.",
                  });
                }
              }}
              expenseToEdit={editingExpense}
            />
          )}
        </DialogContent>
      </Dialog>
      <DeleteExpenseDialog
        expense={expenseToDelete}
        open={!!expenseToDelete}
        onOpenChange={(open) => {
          if (!open) setExpenseToDelete(null);
        }}
      />
    </CardContent>
  );
}
