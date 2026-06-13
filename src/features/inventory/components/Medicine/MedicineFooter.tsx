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
import { Pill } from "lucide-react";
import CreateEditMedicineForm from "./CreateEditMedicineForm";
import { useCreateMedicine } from "@features/inventory/hooks/useMedicine";
import { CreateMedicineRequest } from "@/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function MedicineFooter() {
  const { mutateAsync: createMedicine } = useCreateMedicine();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  return (
    <CardFooter className="bg-muted/15 border-t border-border/40 p-4 justify-start">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5">
            <Pill className="w-4 h-4 ml-1.5" />
            إضافة دواء جديد
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة دواء جديد</DialogTitle>

            <DialogDescription>
              أدخل بيانات الدواء و معلوماته.
            </DialogDescription>
          </DialogHeader>

          <CreateEditMedicineForm
            onSubmit={async (data) => {
              try {
                await createMedicine(data as CreateMedicineRequest);
                toast({
                  title: "تم إنشاء الدواء",
                  description: "تم إنشاء الدواء بنجاح.",
                  variant: "success",
                });
                setOpen(false);
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "فشل إنشاء الدواء",
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
