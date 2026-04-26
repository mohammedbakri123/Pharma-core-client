import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/button";
import { useProfile, useLogout } from "../hooks/useAuth";
import { useAuthStore } from "@features/auth/store/authStore";
import { ProfileForm } from "../components/ProfileForm";

type ProfileFormData = {
  userName: string;
  phoneNumber?: string;
  address?: string;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: profile, isLoading } = useProfile();
  const logoutMutation = useLogout();

  const handleSubmit = (data: ProfileFormData) => {
    // TODO: Implement update profile API call
    console.log("Update profile:", data);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  if (isLoading) return <div className="p-8 text-center">جاري التحميل...</div>;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-muted/40 p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">الملف الشخصي</h1>
          <p className="text-muted-foreground">إدارة بياناتك الشخصية</p>
        </div>

        <ProfileForm
          defaultValues={{
            userName: user?.userName || "",
            phoneNumber: "",
            address: "",
          }}
          onSubmit={handleSubmit}
        />

        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
        </Button>
      </div>
    </div>
  );
}
