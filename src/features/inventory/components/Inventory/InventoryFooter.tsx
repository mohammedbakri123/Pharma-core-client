import { CardFooter } from "@/ui/card";

export default function InventoryFooter() {
  return (
    <CardFooter className="bg-muted/15 border-t border-border/40 p-4 justify-start">
      <p className="text-sm text-muted-foreground">
        مراقبة المخزون - متابعة مستويات المخزون والأصناف منتهية الصلاحية
      </p>
    </CardFooter>
  );
}
