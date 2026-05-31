import { Button } from "@/ui/button";
import { Plus } from "lucide-react";

export default function CustomersHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-heading font-bold text-foreground">
          العملاء
        </h2>
        <p className="text-muted-foreground">
          دليل العملاء المسجلين والسجل الطبي.
        </p>
      </div>

      <Button className="bg-primary hover:bg-primary/90 shadow-md">
        <Plus className="w-4 h-4 ml-2" /> تسجيل عميل جديد
      </Button>
    </div>
  );
}
