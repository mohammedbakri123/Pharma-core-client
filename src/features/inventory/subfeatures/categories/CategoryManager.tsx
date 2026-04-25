import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
} from "./api";
import type {
  CategoryDto,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./types";
import CategoryTable from "./components/CategoryTable";
import CategoryFormOverlay from "./components/CategoryFormOverlay";

export default function CategoryManager() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayMode, setOverlayMode] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryDto | undefined
  >();
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
  });

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategories({
        page,
        limit,
        search: search || undefined,
      });
      setCategories(response.data.categories);
      setPagination(response.data.pagination);
    } catch (err) {
      setError("فشل في تحميل الفئات");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, search]);

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

  const handleSubmit = async (
    data: CreateCategoryRequest | UpdateCategoryRequest
  ) => {
    setActionLoading(true);
    try {
      if (overlayMode === "add") {
        await createCategory(data as CreateCategoryRequest);
      } else if (selectedCategory) {
        await updateCategory(
          selectedCategory.categoryId,
          data as UpdateCategoryRequest
        );
      }
      setShowOverlay(false);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

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
            onClick={() => {
              setPage(1);
              fetchCategories();
            }}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            disabled={loading}
          >
            تحديث
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="البحث عن فئة..."
          className="w-full max-w-sm p-2 border rounded-md"
        />
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
        <>
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                السابق
              </button>
              <span className="px-4">
                صفحة {pagination.page} من {totalPages} ({pagination.total} فئة)
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          )}
        </>
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
