import { Button } from "@/ui/button";
import { FileText } from "lucide-react";

export default function InvoicesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-heading font-bold text-foreground">
          الفواتير
        </h2>
        <p className="text-muted-foreground">إدارة سجل الفواتير والمقبوضات.</p>
      </div>

      <Button>
        <FileText className="w-4 h-4 ml-2" /> فاتورة جديدة
      </Button>
    </div>
  );
}
