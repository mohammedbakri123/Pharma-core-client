import { UserDto } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { useDeleteUser } from "@features/settings/hooks/useUser";

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
  const { mutate: deleteUser, isPending } = useDeleteUser();

  const handleDelete = async () => {
    if (!user) return;

    // mutation
    deleteUser(user.userId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
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

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "جارٍ الحذف..." : "حذف"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
