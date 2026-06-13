import { GetMedicinesRequest, MedicineDto, MedicineUnit } from "@/types";
import { useMedicineList } from "@features/inventory/hooks/useMedicine";

import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Column, DataTable } from "@/ui/data-table";
import MedicineUnitBadge from "./MedicineUnitBadge";
import DeleteMedicineDialog from "./DeleteMedicineDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/ui/button";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { CardContent } from "@/ui/card";
import { Pagination } from "@/ui/pagination";

export default function MedicineTable() {
  const [searchParams] = useSearchParams();

  const [editingMedicine, setEditingMedicine] = useState<MedicineDto | null>(
    null,
  );
  const [medicineToDelete, setMedicineToDelete] = useState<MedicineDto | null>(
    null,
  );

  const filters: GetMedicinesRequest = {
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "10"),
    search: searchParams.get("search") ?? undefined,
    categoryId:
      Number(searchParams.get("categoryId")) == 0
        ? null
        : Number(searchParams.get("categoryId")),
  };

  const {
    data: Medicines,
    isLoading,
    isError,
    error,
    refetch,
  } = useMedicineList(filters);

  const columns: Column<MedicineDto>[] = [
    {
      key: "MedicineArabicName",
      header: "الاسم",
      render: (m) => (
        <span className="font-semibold text-foreground flex items-center gap-2">
          {m.arabicName}
        </span>
      ),
    },
    {
      key: "MedicineName",
      header: "Name",
      render: (m) => (
        <span className="font-semibold text-foreground flex items-center gap-2">
          {m.name}
        </span>
      ),
    },

    {
      key: "unit",
      header: "الوحدة",
      render: (m) => <MedicineUnitBadge unit={m.unit} />,
    },
    {
      key: "barcode",
      header: "الباركود",
      className: "text-muted-foreground font-mono text-xs",
      render: (m) => m.barcode || "-",
    },
    {
      key: "category",
      header: "الفئة",
      className: "text-muted-foreground",
      render: (m) => m.categoryName || "-",
    },
    {
      key: "actions",
      header: "الإجراءات",
      headerClassName: "text-center",
      className: "text-center",
      render: (m) => (
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
                setEditingMedicine(m);
              }}
            >
              <Edit2 />
              تعديل الصنف
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setMedicineToDelete(m);
              }}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              حذف الصنف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <CardContent className="pt-6">
      <DataTable<MedicineDto>
        columns={columns}
        data={Medicines?.medicines || []}
        keyExtractor={(m) => m.medicineId}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyMessage="لم يتم العثور على الاصناف. حاول إضافة أصناف جديدة."
        emptySearchMessage="لا توجد نتائج مطابقة لبحثك"
      />

      {
        <Pagination
          limit={Medicines?.pagination.limit}
          total={Medicines?.pagination.total}
        />
      }
      <DeleteMedicineDialog
        medicine={medicineToDelete}
        open={!!medicineToDelete}
        onOpenChange={(open) => {
          if (!open) setMedicineToDelete(null);
        }}
      />
    </CardContent>
  );
}
