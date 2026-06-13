import { useToast } from "@/hooks/use-toast";
import { GetMedicinesRequest, MedicineDto, MedicineUnit } from "@/types";
import { useMedicineList } from "@features/inventory/hooks/useMedicine";
import { GetUsersRequest, UserDto } from "@features/settings/types/user";
import { Badge } from "@/ui/badge";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Column } from "@/ui/data-table";
import MedicineUnitBadge from "./MedicineUnitBadge";

export default function MedicineTable() {
  const [searchParams] = useSearchParams();

  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserDto | null>(null);

  const { toast } = useToast();

  const filters: GetMedicinesRequest = {
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "10"),
    search: searchParams.get("search") ?? undefined,
    categoryId: Number(searchParams.get("categoryId") ?? undefined),
  };

  const {
    data: users,
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
      key: "phoneNumber",
      header: "الهاتف",
      className: "text-muted-foreground font-mono text-xs",
      render: (u) => u.phoneNumber || "-",
    },
    {
      key: "address",
      header: "العنوان",
      className: "text-muted-foreground",
      render: (u) => u.address || "-",
    },
    {
      key: "actions",
      header: "الإجراءات",
      headerClassName: "text-center",
      className: "text-center",
      render: (u) => (
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
                setEditingUser(u);
              }}
            >
              <Edit2 />
              تعديل المستخدم
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={u.userId === currentUser?.userId}
              onSelect={(e) => {
                e.preventDefault();
                setUserToDelete(u);
              }}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              حذف المستخدم
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return <div>Medicine</div>;
}
