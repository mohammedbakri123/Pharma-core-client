import { useState, useCallback, useEffect, useRef } from "react";
import {
  useUsersList,
  useCreateUser,
  useDeleteUser,
  useCurrentUser,
} from "../hooks/useUser";
import { UserRole } from "@features/auth/types";
import {
  Card,
  CardContent,

  CardFooter,
} from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Badge } from "@/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus,
  Users,
  Trash2,
  UserCheck,
  Search,
  User,
  Lock,
  Phone,
  MapPin,
  RefreshCw,
  MoreHorizontal,
  Edit2,
} from "lucide-react";
import { UserDto } from "@/types";
import { DataTable, type Column } from "@/ui/data-table";
import { Pagination } from "@/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/ui/dialog";
import { ConfirmDialog } from "@/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/ui/dropdown-menu";
import UserSettingsHeader from "./UserSettingsHeader";

const PAGE_LIMIT = 10;

export default function UsersSettings() {
  const { toast } = useToast();
  const currentUser = useCurrentUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newUserName, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newRole, setNewRole] = useState<UserRole>(UserRole.Cashier);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const searchRef = useRef(searchQuery);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    searchRef.current = searchQuery;
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: usersResponse,
    isLoading,
    isError,
    refetch,
  } = useUsersList(page, PAGE_LIMIT, debouncedSearch);
  const users = usersResponse?.users || [];
  const pagination = usersResponse?.pagination;

  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();

  const resetForm = useCallback(() => {
    setNewUserName("");
    setNewPassword("");
    setNewPhone("");
    setNewAddress("");
    setNewRole(UserRole.Cashier);
    setFormError("");
  }, []);

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newUserName.trim() || newUserName.length < 3) {
      setFormError("اسم المستخدم يجب أن لا يقل عن 3 أحرف");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setFormError("كلمة المرور يجب أن لا تقل عن 6 أحرف");
      return;
    }

    createUserMutation.mutate(
      {
        userName: newUserName,
        password: newPassword,
        phoneNumber: newPhone || undefined,
        address: newAddress || undefined,
        role: newRole,
      },
      {
        onSuccess: () => {
          toast({
            title: "تمت إضافة المستخدم",
            description: `تم إنشاء حساب المستخدم ${newUserName} بنجاح.`,
          });
          resetForm();
          setIsAddDialogOpen(false);
        },
        onError: (error: any) => {
          setFormError(
            error?.message ||
              error?.response?.data?.message ||
              "حدث خطأ أثناء إضافة المستخدم."
          );
        },
      }
    );
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    if (userId === currentUser?.userId) {
      toast({
        variant: "destructive",
        title: "إجراء غير مسموع",
        description: "لا يمكنك حذف حسابك الذي تسجل الدخول به حالياً.",
      });
      return;
    }
    setDeleteTarget({ id: userId, name: userName });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteUserMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast({
          title: "تم حذف المستخدم",
          description: "تم تعطيل/حذف حساب المستخدم بنجاح.",
        });
        setDeleteTarget(null);
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "فشل الحذف",
          description:
            error?.response?.data?.message ||
            "حدث خطأ أثناء حذف المستخدم.",
        });
        setDeleteTarget(null);
      },
    });
  };

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
              <Edit2/>
              تعديل المستخدم
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteUser(u.userId, u.userName)}
              disabled={
                u.userId === currentUser?.userId || deleteUserMutation.isPending
              }
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
    <Card className="border-border/40 shadow-md">
     <UserSettingsHeader refetch={refetch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <CardContent className="pt-6">
        <DataTable<UserDto>
          columns={columns}
          data={users}
          keyExtractor={(u) => u.userId}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          emptyMessage="لم يتم العثور على مستخدمين"
          emptySearchMessage="لا توجد نتائج مطابقة لبحثك"
          searchQuery={debouncedSearch}
        />

        {pagination && (
          <Pagination
            page={page}
            total={pagination.total}
            limit={PAGE_LIMIT}
            onPageChange={setPage}
          />
        )}
      </CardContent>

      <CardFooter className="bg-muted/15 border-t border-border/40 p-4 justify-start">
        <Button
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 transition-all duration-200"
        >
          <UserPlus className="w-4 h-4 ml-1.5" />
          إضافة مستخدم جديد
        </Button>
      </CardFooter>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" /> إضافة مستخدم جديد
              للنظام
            </DialogTitle>
            <DialogDescription>
              أدخل بيانات المستخدم الجديد وصلاحياته.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUserSubmit} className="space-y-4 text-right">
            {formError && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-md border border-destructive/20 font-semibold">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newUserName">اسم المستخدم</Label>
                <div className="relative">
                  <Input
                    id="newUserName"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="pr-10 text-right bg-background focus-visible:ring-primary/30"
                    placeholder="مثال: ahmad_pharmacist"
                    required
                  />
                  <User className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">كلمة المرور المؤقتة</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10 text-right bg-background focus-visible:ring-primary/30"
                    placeholder="6 خانات على الأقل"
                    required
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPhone">رقم الهاتف (اختياري)</Label>
                <div className="relative">
                  <Input
                    id="newPhone"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="pr-10 text-right bg-background focus-visible:ring-primary/30"
                    placeholder="+966 50 000 0000"
                  />
                  <Phone className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newAddress">العنوان (اختياري)</Label>
                <div className="relative">
                  <Input
                    id="newAddress"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="pr-10 text-right bg-background focus-visible:ring-primary/30"
                    placeholder="الحي، المدينة"
                  />
                  <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>صلاحية النظام</Label>
              <div className="flex gap-4 pt-1 justify-end">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <span>صيدلاني / كاشير</span>
                  <input
                    type="radio"
                    name="newRole"
                    checked={newRole === UserRole.Cashier}
                    onChange={() => setNewRole(UserRole.Cashier)}
                    className="text-primary focus:ring-primary h-4 w-4"
                  />
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <span>مدير نظام (كامل الصلاحيات)</span>
                  <input
                    type="radio"
                    name="newRole"
                    checked={newRole === UserRole.Admin}
                    onChange={() => setNewRole(UserRole.Admin)}
                    className="text-primary focus:ring-primary h-4 w-4"
                  />
                </label>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={createUserMutation.isPending}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5"
              >
                {createUserMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin ml-1.5" />
                ) : (
                  <UserCheck className="w-4 h-4 ml-1.5" />
                )}
                حفظ المستخدم
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="حذف مستخدم"
        description={
          deleteTarget
            ? `هل أنت متأكد من رغبتك في حذف حساب المستخدم: ${deleteTarget.name}؟`
            : ""
        }
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        onConfirm={confirmDelete}
        isPending={deleteUserMutation.isPending}
        variant="destructive"
      />
    </Card>
  );
}
