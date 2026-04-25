import { useState, useEffect } from "react";
import type { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from "../types";

interface CategoryFormOverlayProps {
  mode: "add" | "edit";
  category?: CategoryDto;
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function CategoryFormOverlay({
  mode,
  category,
  onSubmit,
  onClose,
  isLoading = false,
}: CategoryFormOverlayProps) {
  const [categoryName, setCategoryName] = useState("");
  const [arabicName, setArabicName] = useState("");

  useEffect(() => {
    if (mode === "edit" && category) {
      setCategoryName(category.categoryName);
      setArabicName(category.categoryArabicName || "");
    }
  }, [mode, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (mode === "add") {
      onSubmit({
        categoryName: categoryName.trim(),
        categoryArabicName: arabicName.trim() || undefined,
      });
    } else {
      onSubmit({
        categoryName: categoryName.trim() || undefined,
        categoryArabicName: arabicName.trim() || undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">
          {mode === "add" ? "إضافة فئة جديدة" : "تعديل الفئة"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">اسم الفئة (بالإنجليزية)</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="أدخل اسم الفئة"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">الاسم العربي</label>
            <input
              type="text"
              value={arabicName}
              onChange={(e) => setArabicName(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="أدخل الاسم العربي"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-muted"
              disabled={isLoading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              disabled={isLoading || !categoryName.trim()}
            >
              {isLoading ? "جاري الحفظ..." : mode === "add" ? "إضافة" : "تحديث"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
