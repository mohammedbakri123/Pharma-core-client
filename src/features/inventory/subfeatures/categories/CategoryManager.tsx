import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
} from "./api";
import type { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from "./types";
import CategoryTable from "./components/CategoryTable";
import CategoryFormOverlay from "./components/CategoryFormOverlay";

export default function CategoryManager() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayMode, setOverlayMode] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | undefined>();
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategories();
      setCategories(response.data.categories);
    } catch (err) {
      setError("فشل في تحميل الفئات");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setOverlayMode("add");
    setSelectedCategory(undefined);
    setShowOverlay(true);
  };

  const handleEdit = (category: CategoryDto) => {
    setOverlayMode("edit");
    setSelectedCategory(category);
    setShowOverlay(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;
    try {
      await deleteCategory(categoryId);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleRestore = async (categoryId: number) => {
    try {
      await restoreCategory(categoryId);
      fetchCategories();
    } catch (err) {
      console.error("Error restoring category:", err);
    }
  };

  const handleSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    setActionLoading(true);
    try {
      if (overlayMode === "add") {
        await createCategory(data as CreateCategoryRequest);
      } else if (selectedCategory) {
        await updateCategory(selectedCategory.categoryId, data as UpdateCategoryRequest);
      }
      setShowOverlay(false);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">إدارة الفئات</h3>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            إضافة فئة
          </button>
          <button
            onClick={fetchCategories}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            disabled={loading}
          >
            تحديث
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : error ? (
        <div className="text-destructive text-center py-8">{error}</div>
      ) : categories.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          لا توجد فئات لعرضها
        </p>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />
      )}
      {showOverlay && (
        <CategoryFormOverlay
          mode={overlayMode}
          category={selectedCategory}
          onSubmit={handleSubmit}
          onClose={() => setShowOverlay(false)}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
}
