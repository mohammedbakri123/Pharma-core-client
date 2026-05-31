import { useState } from "react";
import { getMedicines } from "@/api/medicines";
import type { MedicineDto } from "@/types";

export default function MedicineManager() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implement useEffect to fetch medicines
  // useEffect(() => {
  //   fetchMedicines();
  // }, []);

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">إدارة الأدوية</h3>
      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : error ? (
        <div className="text-destructive text-center py-8">{error}</div>
      ) : medicines.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">لا توجد أدوية لعرضها</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {medicines.map((med) => (
            <div key={med.id} className="p-4 border-b last:border-b-0 flex justify-between items-center">
              <span>{med.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
