import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import CategoryManager from "./subfeatures/categories";
import StockManager from "./subfeatures/stock";
import MedicineManager from "./subfeatures/medicines";
import PurchaseManager from "./subfeatures/purchases";

export default function Inventory() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-3xl font-heading font-bold text-foreground">
          إدارة المخزون
        </h2>
        <p className="text-muted-foreground">
          إدارة الفئات، المخزون، الأدوية، والمشتريات
        </p>
      </div>

      <Tabs defaultValue="stock" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">الفئات</TabsTrigger>
          <TabsTrigger value="stock">المخزون</TabsTrigger>
          <TabsTrigger value="medicines">الأدوية</TabsTrigger>
          <TabsTrigger value="purchases">المشتريات</TabsTrigger>
        </TabsList>

        <div className="mt-6 bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="stock">
            <StockManager />
          </TabsContent>

          <TabsContent value="medicines">
            <MedicineManager />
          </TabsContent>

          <TabsContent value="purchases">
            <PurchaseManager />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
