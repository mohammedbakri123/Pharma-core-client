import { useState } from "react";
import { getPurchases } from "@/api/purchases";
import type { PurchaseDto } from "@/types";

export default function PurchaseManager() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implement useEffect to fetch purchases
  // useEffect(() => {
  //   fetchPurchases();
  // }, []);

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">المشتريات</h3>
      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : error ? (
        <div className="text-destructive text-center py-8">{error}</div>
      ) : purchases.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">لا توجد مشتريات لعرضها</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="p-4 border-b last:border-b-0 flex justify-between items-center">
              <span>مشتريات #{purchase.id}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
