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
import { Coins } from "lucide-react";
import CreateSaleForm from "./CreateSaleForm";
import { useCreateSale } from "../../hooks/useSales";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SalesFooter() {
  const { mutateAsync: createSale } = useCreateSale();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  return (
    <CardFooter className="bg-muted/15 border-t border-border/40 p-4 justify-start">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5">
            <Coins className="w-4 h-4 ml-1.5" />
            إضافة فاتورة مبيعات
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة فاتورة مبيعات</DialogTitle>

            <DialogDescription>
              أدخل بيانات الفاتورة.
            </DialogDescription>
          </DialogHeader>

          <CreateSaleForm
            onSubmit={async (data) => {
              try {
                await createSale(data);
                toast({
                  title: "تم إنشاء الفاتورة",
                  description: "تم إنشاء فاتورة المبيعات بنجاح.",
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
