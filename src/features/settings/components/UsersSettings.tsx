import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api";
import { UserRole } from "@features/auth/types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Badge } from "@/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@features/auth/store/authStore";
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
  UserX,
  X
} from "lucide-react";

export default function UsersSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  // Add User Form States
  const [newUserName, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newRole, setNewRole] = useState<UserRole>(UserRole.Cashier);
  const [formError, setFormError] = useState("");

  // Query: Fetch users list
  const { data: usersResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      const res = await usersApi.getAll({ limit: 100 });
      return res.data;
    },
  });

  const users = usersResponse?.users || [];

  // Mutation: Create user
  const createUserMutation = useMutation({
    mutationFn: async () => {
      if (!newUserName.trim() || newUserName.length < 3) {
        throw new Error("اسم المستخدم يجب أن لا يقل عن 3 أحرف");
      }
      if (!newPassword || newPassword.length < 6) {
        throw new Error("كلمة المرور يجب أن لا تقل عن 6 أحرف");
      }
      return usersApi.create({
        userName: newUserName,
        password: newPassword,
        phoneNumber: newPhone || undefined,
        address: newAddress || undefined,
        role: newRole,
      });
    },
    onSuccess: () => {
      toast({
        title: "تمت إضافة المستخدم",
        description: `تم إنشاء حساب المستخدم ${newUserName} بنجاح.`,
      });
      // Reset form
      setNewUserName("");
      setNewPassword("");
      setNewPhone("");
      setNewAddress("");
      setNewRole(UserRole.Cashier);
      setIsAddingUser(false);
      setFormError("");
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
    onError: (error: any) => {
      setFormError(error.message || error.response?.data?.message || "حدث خطأ أثناء إضافة المستخدم.");
    },
  });

  // Mutation: Delete user
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      return usersApi.delete(userId);
    },
    onSuccess: (_, deletedId) => {
      toast({
        title: "تم حذف المستخدم",
        description: "تم تعطيل/حذف حساب المستخدم بنجاح.",
      });
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل الحذف",
        description: error.response?.data?.message || "حدث خطأ أثناء حذف المستخدم.",
      });
    },
  });

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    createUserMutation.mutate();
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    if (userId === currentUser?.userId) {
      toast({
        variant: "destructive",
        title: "إجراء غير مسموح",
        description: "لا يمكنك حذف حسابك الذي تسجل الدخول به حالياً.",
      });
      return;
    }

    if (confirm(`هل أنت متأكد من رغبتك في حذف حساب المستخدم: ${userName}؟`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((u) => 
    u.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.phoneNumber && u.phoneNumber.includes(searchQuery))
  );

  const getRoleBadge = (role: number) => {
    if (role === 1) return <Badge className="bg-primary hover:bg-primary/95 text-white">مدير النظام</Badge>;
    return <Badge variant="secondary">صيدلاني / كاشير</Badge>;
  };

  return (
    <Card className="border-border/40 shadow-md">
      <CardHeader className="text-right border-b border-border/40 bg-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="order-2 sm:order-1 flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن مستخدم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 text-right bg-background focus-visible:ring-primary/30"
              />
            </div>
            <Button 
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="text-muted-foreground hover:text-primary shrink-0"
              title="تحديث القائمة"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="order-1 sm:order-2">
            <CardTitle className="text-lg flex items-center gap-2 justify-end">
              <Users className="w-5 h-5 text-primary" /> إدارة المستخدمين
            </CardTitle>
            <CardDescription className="text-right">إدارة صلاحيات وصول الصيادلة والموظفين للنظام.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        
        {/* Inline form to Add User */}
        {isAddingUser && (
          <div className="mb-6 p-5 border border-primary/20 rounded-lg bg-primary/5 animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-primary/10">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsAddingUser(false)} 
                className="text-muted-foreground hover:text-foreground h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
              <h4 className="font-semibold text-primary text-base flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" /> إضافة مستخدم جديد للنظام
              </h4>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-right">
              {formError && (
                <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-md border border-destructive/20 font-semibold">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Username */}
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

                {/* Password */}
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
                
                {/* Phone */}
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

                {/* Address */}
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

              {/* Role Selection */}
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

              <div className="flex justify-start gap-2 pt-2 border-t border-primary/10">
                <Button 
                  type="submit" 
                  disabled={createUserMutation.isPending}
                  className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 transition-all"
                >
                  {createUserMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 animate-spin ml-1.5" />
                  ) : (
                    <UserCheck className="w-4 h-4 ml-1.5" />
                  )}
                  حفظ المستخدم
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddingUser(false)}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table / List */}
        {isLoading ? (
          <div className="py-10 text-center flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">جاري تحميل قائمة المستخدمين...</span>
          </div>
        ) : isError ? (
          <div className="py-10 text-center text-destructive flex flex-col items-center justify-center gap-2 border border-destructive/20 rounded-lg bg-destructive/5">
            <UserX className="w-8 h-8 text-destructive" />
            <span className="font-semibold text-sm">فشل تحميل المستخدمين</span>
            <span className="text-xs text-muted-foreground">يرجى التأكد من تشغيل خادم backend والمحاولة مرة أخرى.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2 border-destructive text-destructive hover:bg-destructive/10">
              إعادة المحاولة
            </Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-lg bg-muted/10">
            <Users className="w-8 h-8 text-muted-foreground/55" />
            <span className="text-sm font-medium">لم يتم العثور على مستخدمين</span>
            {searchQuery && <span className="text-xs">لا توجد نتائج مطابقة لبحثك: "{searchQuery}"</span>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="py-3 px-4 font-semibold text-muted-foreground">الاسم</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground">الصلاحية</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground">الهاتف</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground">العنوان</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredUsers.map((u) => (
                  <tr key={u.userId} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2 justify-end">
                      {u.userName}
                      {u.userId === currentUser?.userId && (
                        <Badge variant="outline" className="text-xxs border-primary/40 text-primary bg-primary/5">أنت</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">{getRoleBadge(u.role)}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{u.phoneNumber || "-"}</td>
                    <td className="py-3 px-4 text-muted-foreground">{u.address || "-"}</td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(u.userId, u.userName)}
                        disabled={u.userId === currentUser?.userId || deleteUserMutation.isPending}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 transition-colors shrink-0"
                        title="حذف المستخدم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </CardContent>
      
      {!isAddingUser && (
        <CardFooter className="bg-muted/15 border-t border-border/40 p-4 justify-start">
          <Button 
            onClick={() => setIsAddingUser(true)}
            className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 transition-all duration-200"
          >
            <UserPlus className="w-4 h-4 ml-1.5" />
            إضافة مستخدم جديد
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
