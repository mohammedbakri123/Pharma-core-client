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

export default function UserFooter() {
  return (
    <CardFooter className="bg-muted/15 border-t border-border/40 p-4 justify-start">
      <Dialog>
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
          <CreateEditUserForm />
        </DialogContent>
      </Dialog>
    </CardFooter>
  );
}
