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
import CreateEditCustomerForm from "./CreateEditCustomerForm";
import { useCreateCustomer } from "../../hooks/useCustomers";
import type { CreateCustomerRequest } from "@/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CustomersFooter() {
  const { mutateAsync: createCustomer } = useCreateCustomer();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  return (
    <CardFooter className="bg-muted/15 border-t border-border/40 p-4 justify-start">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 ml-1.5" />
            إضافة عميل جديد
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة عميل جديد</DialogTitle>

            <DialogDescription>
              أدخل بيانات العميل ومعلوماته.
            </DialogDescription>
          </DialogHeader>

          <CreateEditCustomerForm
            onSubmit={async (data) => {
              try {
                await createCustomer(data as CreateCustomerRequest);
                toast({
                  title: "تم إنشاء العميل",
                  description: "تم إنشاء العميل بنجاح.",
                  variant: "success",
                });
                setOpen(false);
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "فشل إنشاء العميل",
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
