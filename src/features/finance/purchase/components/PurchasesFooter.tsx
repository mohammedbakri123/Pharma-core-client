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
import { Wallet } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreatePurchase } from "../../common/hooks/usePurchases";
import CreatePurchaseForm from "./CreatePurchaseForm";

export default function PurchasesFooter() {
  const { mutateAsync: createPurchase } = useCreatePurchase();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  return (
    <CardFooter className="bg-muted/15 border-t border-border/40 p-4 justify-start">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5">
            <Wallet className="w-4 h-4 ml-1.5" />
            إضافة فاتورة مشتريات
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة فاتورة مشتريات</DialogTitle>

            <DialogDescription>أدخل بيانات الفاتورة.</DialogDescription>
          </DialogHeader>

          <CreatePurchaseForm
            onSubmit={async (data) => {
              try {
                await createPurchase(data);
                toast({
                  title: "تم إنشاء الفاتورة",
                  description: "تم إنشاء فاتورة المشتريات بنجاح.",
                  variant: "success",
                });
                setOpen(false);
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "فشل إنشاء الفاتورة",
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
