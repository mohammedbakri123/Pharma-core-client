import { Button } from "@/ui/button";
import { Plus } from "lucide-react";

export default function InventoryHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-heading font-bold text-foreground">
          المخزون
        </h2>
        <p className="text-muted-foreground">
          إدارة مخزون الأدوية وتواريخ انتهاء الصلاحية.
        </p>
      </div>

      <div>
        <Button className="bg-primary hover:bg-primary/90 shadow-md">
          عرض الاصناف
        </Button>
        <Button className="bg-primary hover:bg-primary/90 shadow-md">
          عرض الفئات{" "}
        </Button>
        <Button className="bg-primary hover:bg-primary/90 shadow-md">
          عرض الادوية المنتهية الصلاحية
        </Button>
        <Button className="bg-primary hover:bg-primary/90 shadow-md">
          <Plus className="mr-2" />
          إضافة مخزون جديد
        </Button>
      </div>
    </div>
  );
}
