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
import { Truck } from "lucide-react";
import CreateEditSupplierForm from "./CreateEditSupplierForm";
import { useCreateSupplier } from "../../hooks/useSuppliers";
import type { CreateSupplierRequest } from "@/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SuppliersFooter() {
  const { mutateAsync: createSupplier } = useCreateSupplier();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  return (
    <CardFooter className="bg-muted/15 border-t border-border/40 p-4 justify-start">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5">
            <Truck className="w-4 h-4 ml-1.5" />
            إضافة مورد جديد
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مورد جديد</DialogTitle>

            <DialogDescription>
              أدخل بيانات المورد ومعلوماته.
            </DialogDescription>
          </DialogHeader>

          <CreateEditSupplierForm
            onSubmit={async (data) => {
              try {
                await createSupplier(data as CreateSupplierRequest);
                toast({
                  title: "تم إنشاء المورد",
                  description: "تم إنشاء المورد بنجاح.",
                  variant: "success",
                });
                setOpen(false);
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "فشل إنشاء المورد",
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
