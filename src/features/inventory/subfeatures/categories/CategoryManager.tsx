import { useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/categories";
import type { CategoryDto } from "@/types";

export default function CategoryManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implement useEffect to fetch categories
  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">إدارة الفئات</h3>
      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : error ? (
        <div className="text-destructive text-center py-8">{error}</div>
      ) : categories.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          لا توجد فئات لعرضها
        </p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 border-b last:border-b-0 flex justify-between items-center"
            >
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
