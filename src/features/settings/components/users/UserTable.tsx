import { Column, DataTable } from "@/ui/data-table";
import { Badge } from "@/ui/badge";

import { useCurrentUser, useUsersList } from "@features/settings/hooks/useUser";
import { GetUsersRequest, UserDto } from "@features/settings/types/user";
import { UserRole } from "@features/auth/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";
import { Edit2, MoreHorizontal, Trash, Trash2 } from "lucide-react";
import { CardContent } from "@/ui/card";
import { Pagination } from "@/ui/pagination";
import { useSearchParams } from "react-router-dom";

export default function UserTable() {
  const currentUser = useCurrentUser();

  const [searchParams] = useSearchParams();

  const filters: GetUsersRequest = {
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "10"),
    search: searchParams.get("search") ?? undefined,
  };

  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsersList(filters);

  const getRoleBadge = (role: UserRole) => {
    if (role === UserRole.Admin)
      return (
        <Badge className="bg-primary hover:bg-primary/95 text-white">
          مدير النظام
        </Badge>
      );
    return <Badge variant="secondary">صيدلاني / كاشير</Badge>;
  };

  const columns: Column<UserDto>[] = [
    {
      key: "userName",
      header: "الاسم",
      render: (u) => (
        <span className="font-semibold text-foreground flex items-center gap-2">
          {u.userName}
          {u.userId === currentUser?.userId && (
            <Badge
              variant="outline"
              className="border-primary/40 text-primary bg-primary/5 text-[10px] px-1.5 py-0"
            >
              أنت
            </Badge>
          )}
        </span>
      ),
    },
    {
      key: "role",
      header: "الصلاحية",
      render: (u) => getRoleBadge(u.role),
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
        <DropdownMenu>
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
              onClick={() => {}}
              className="text-muted-foreground  focus:bg-muted/10 cursor-pointer"
            >
              <Edit2 />
              تعديل المستخدم
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {}}
              disabled={u.userId === currentUser?.userId}
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
  return (
    <CardContent className="pt-6">
      <DataTable<UserDto>
        columns={columns}
        data={users?.users || []}
        keyExtractor={(u) => u.userId}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyMessage="لم يتم العثور على مستخدمين"
        emptySearchMessage="لا توجد نتائج مطابقة لبحثك"
      />

      {
        <Pagination
          limit={users?.pagination.limit}
          total={users?.pagination.total}
        />
      }
    </CardContent>
  );
}
