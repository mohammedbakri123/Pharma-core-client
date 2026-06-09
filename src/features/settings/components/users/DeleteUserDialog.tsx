import { UserDto } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/ui/dialog";
import { Button } from "@/ui/button";

interface DeleteUserDialogProps {
  user: UserDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function DeleteUserDialog({
  user,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const handleDelete = async () => {
    if (!user) return;

    // mutation

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف المستخدم</DialogTitle>

          <DialogDescription>
            هل أنت متأكد من حذف المستخدم {user?.userName}؟
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>

          <Button variant="destructive" onClick={handleDelete}>
            حذف
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
