import { Button } from "@/ui/button";
import { CardFooter } from "@/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { UserPlus } from "lucide-react";
import CreateEditUserForm from "./CreateEditUserForm";
import { useCreateUser } from "@features/settings/hooks/useUser";
import { CreateUserRequest } from "@/types";
import { useState } from "react";
import { toast, useToast } from "@/hooks/use-toast";
export default function UserFooter() {
  const { mutateAsync: createUser } = useCreateUser();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  return (
    <CardFooter className="bg-muted/15 border-t border-border/40 p-4 justify-start">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 ml-1.5" />
            إضافة مستخدم جديد
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>

            <DialogDescription>
              أدخل بيانات المستخدم وصلاحياته.
            </DialogDescription>
          </DialogHeader>

          <CreateEditUserForm
            onSubmit={async (data) => {
              try {
                await createUser(data as CreateUserRequest);
                toast({
                  title: "تم إنشاء المستخدم",
                  description: "تم إنشاء المستخدم بنجاح.",
                  variant: "success",
                });
                setOpen(false);
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "فشل إنشاء المستخدم",
                  description:
                    error instanceof Error
                      ? error.message
                      : "حدث خطأ غير متوقع.",
                });
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </CardFooter>
  );
}
