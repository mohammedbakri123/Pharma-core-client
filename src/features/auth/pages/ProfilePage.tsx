import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Phone,
  MapPin,
  Lock,
  Shield,
  Calendar,
  Save,
  KeyRound,
  RefreshCw,
  LogOut,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Badge } from "@/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@features/auth/store/authStore";
import { useProfile, useLogout, useUpdateProfile } from "../hooks/useAuth";
import { useCurrentUser } from "@features/settings/hooks/useUser";
import { UserRole } from "../types";

const profileSchema = z.object({
  userName: z.string().min(3, "اسم المستخدم يجب أن لا يقل عن 3 أحرف"),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

const passwordSchema = z
  .object({
    password: z.string().min(6, "كلمة المرور يجب أن لا تقل عن 6 أحرف"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useCurrentUser();
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    refetch,
  } = useProfile();
  const logoutMutation = useLogout();
  const updateMutation = useUpdateProfile();

  const profile = profileResponse?.data;
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: "",
      phoneNumber: "",
      address: "",
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  // Load profile data into form once fetched
  useEffect(() => {
    if (profile) {
      resetProfile({
        userName: profile.userName || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
      });
    } else if (user) {
      resetProfile({
        userName: user.userName || "",
        phoneNumber: "",
        address: "",
      });
    }
  }, [profile, user, resetProfile]);

  const onUpdateProfile = async (data: ProfileFormValues) => {
    updateMutation.mutate(
      {
        userName: data.userName,
        phoneNumber: data.phoneNumber || undefined,
        address: data.address || undefined,
      },
      {
        onSuccess: () => {
          toast({
            title: "تم حفظ التعديلات",
            description: "تم تحديث معلومات الملف الشخصي بنجاح.",
          });
          refetch();
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "فشل الحفظ",
            description:
              error.response?.data?.message || "حدث خطأ غير متوقع أثناء الحفظ.",
          });
        },
      },
    );
  };

  const onUpdatePassword = async (data: PasswordFormValues) => {
    setIsPasswordChanging(true);
    updateMutation.mutate(
      {
        password: data.password,
      },
      {
        onSuccess: () => {
          toast({
            title: "تم تحديث الأمان",
            description: "تم تغيير كلمة المرور بنجاح.",
          });
          resetPassword({ password: "", confirmPassword: "" });
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "فشل تحديث كلمة المرور",
            description:
              error.response?.data?.message ||
              "حدث خطأ أثناء تغيير كلمة المرور.",
          });
        },
        onSettled: () => {
          setIsPasswordChanging(false);
        },
      },
    );
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  const getRoleBadge = (role?: UserRole) => {
    if (role === UserRole.Admin)
      return (
        <Badge className="bg-primary hover:bg-primary/95 text-white">
          مدير النظام (Admin)
        </Badge>
      );
    if (role === UserRole.Cashier)
      return <Badge variant="secondary">كاشير / صيدلاني (Cashier)</Badge>;
    return <Badge variant="outline">مستخدم</Badge>;
  };

  if (isProfileLoading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-10 bg-muted rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-75 bg-muted rounded md:col-span-1"></div>
          <div className="h-112.5 bg-muted rounded md:col-span-2"></div>
        </div>
      </div>
    );
  }

  const displayName = profile?.userName || user?.userName || "مستخدم فارماكور";
  const displayRole = profile?.role ?? user?.role;
  const displayCreated = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("ar-SA")
    : "غير متوفر";

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div>
        <h2 className="text-3xl font-heading font-bold text-foreground">
          الملف الشخصي
        </h2>
        <p className="text-muted-foreground mt-1">
          إدارة بيانات حسابك وتفاصيل الأمان الخاصة بك.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Profile Card */}
        <div className="space-y-6 md:col-span-1">
          <Card className="overflow-hidden border-border/40 shadow-md">
            <div className="h-28 bg-linear-to-l from-primary/80 to-primary/40 relative"></div>
            <CardContent className="pt-0 pb-6 text-center relative">
              <div className="flex justify-center -mt-14 mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-card bg-card overflow-hidden shadow-lg flex items-center justify-center">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayName}&backgroundColor=1ab298&textColor=ffffff`}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground truncate">
                {displayName}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                صيدلية فارماكور
              </p>

              <div className="mt-3 flex justify-center">
                {getRoleBadge(displayRole)}
              </div>

              <div className="mt-6 pt-6 border-t border-border/60 text-right space-y-3 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-primary" /> الصلاحية
                  </span>
                  <span className="font-semibold text-foreground">
                    {displayRole === 1 ? "كامل الصلاحيات" : "صلاحيات محدودة"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" /> تاريخ الإنشاء
                  </span>
                  <span className="font-medium text-foreground">
                    {displayCreated}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/30 border-t border-border/40 p-4">
              <Button
                variant="outline"
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4 ml-2" />
                {logoutMutation.isPending
                  ? "جاري تسجيل الخروج..."
                  : "تسجيل الخروج من النظام"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Side: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Form 1: Profile Details */}
          <Card className="border-border/40 shadow-md">
            <CardHeader className="border-b border-border/40 bg-card">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> تعديل البيانات الشخصية
              </CardTitle>
              <CardDescription>
                قم بتحديث اسم المستخدم وتفاصيل الاتصال الخاصة بك.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleProfileSubmit(onUpdateProfile)}>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="userName">اسم المستخدم</Label>
                    <div className="relative">
                      <Input
                        id="userName"
                        {...registerProfile("userName")}
                        className="pr-10 text-right bg-background focus-visible:ring-primary/30"
                        placeholder="أدخل اسم المستخدم"
                      />
                      <User className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    {profileErrors.userName && (
                      <p className="text-xs text-destructive mt-1 font-medium">
                        {profileErrors.userName.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">رقم الهاتف</Label>
                    <div className="relative">
                      <Input
                        id="phoneNumber"
                        {...registerProfile("phoneNumber")}
                        className="pr-10 text-right bg-background focus-visible:ring-primary/30"
                        placeholder="أدخل رقم الهاتف"
                      />
                      <Phone className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">العنوان الكامل</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      {...registerProfile("address")}
                      className="pr-10 text-right bg-background focus-visible:ring-primary/30"
                      placeholder="أدخل عنوان السكن"
                    />
                    <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t border-border/40 bg-muted/20 p-4 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {isProfileDirty
                    ? "توجد تغييرات غير محفوظة"
                    : "لم تقم بتعديل البيانات بعد"}
                </span>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || !isProfileDirty}
                  className="bg-primary hover:bg-primary/95 text-white shadow-sm flex items-center gap-1.5 transition-all duration-200"
                >
                  {updateMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 animate-spin ml-1.5" />
                  ) : (
                    <Save className="w-4 h-4 ml-1.5" />
                  )}
                  حفظ التغييرات
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Form 2: Change Password */}
          <Card className="border-border/40 shadow-md">
            <CardHeader className="border-b border-border/40 bg-card">
              <CardTitle className="text-lg flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-primary" /> تغيير كلمة المرور
              </CardTitle>
              <CardDescription>
                لتأمين حسابك، يرجى تعيين كلمة مرور قوية.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handlePasswordSubmit(onUpdatePassword)}>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور الجديدة</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        {...registerPassword("password")}
                        className="pr-10 text-right bg-background focus-visible:ring-primary/30"
                        placeholder="كلمة مرور جديدة"
                      />
                      <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    {passwordErrors.password && (
                      <p className="text-xs text-destructive mt-1 font-medium">
                        {passwordErrors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...registerPassword("confirmPassword")}
                        className="pr-10 text-right bg-background focus-visible:ring-primary/30"
                        placeholder="أعد كتابة كلمة المرور"
                      />
                      <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-xs text-destructive mt-1 font-medium">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t border-border/40 bg-muted/20 p-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isPasswordChanging}
                  className="bg-zinc-800 hover:bg-zinc-750 dark:bg-zinc-700 dark:hover:bg-zinc-650 text-white shadow-sm flex items-center gap-1.5 transition-all duration-200"
                >
                  {isPasswordChanging ? (
                    <RefreshCw className="w-4 h-4 animate-spin ml-1.5" />
                  ) : (
                    <KeyRound className="w-4 h-4 ml-1.5" />
                  )}
                  تحديث كلمة المرور
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
