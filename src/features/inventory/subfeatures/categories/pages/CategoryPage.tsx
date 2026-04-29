import { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useRestoreCategory } from "../hooks/useCategories";
import type { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from "../types";
import CategoryTable from "../components/CategoryTable";
import CategoryFormOverlay from "../components/CategoryFormOverlay";

export default function CategoryPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayMode, setOverlayMode] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | undefined>();

  const { data, isLoading, error, refetch } = useCategories({ page, limit, search });
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const restoreMutation = useRestoreCategory();

  const categories = data?.data.categories ?? [];
  const pagination = data?.data.pagination ?? { total: 0, page: 1, limit: 10 };

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
    await deleteMutation.mutateAsync(categoryId);
  };

  const handleRestore = async (categoryId: number) => {
    await restoreMutation.mutateAsync(categoryId);
  };

  const handleSubmit = async (
    data: CreateCategoryRequest | UpdateCategoryRequest
  ) => {
    try {
      if (overlayMode === "add") {
        await createMutation.mutateAsync(data as CreateCategoryRequest);
      } else if (selectedCategory) {
        await updateMutation.mutateAsync({
          id: selectedCategory.categoryId,
          data: data as UpdateCategoryRequest,
        });
      }
      setShowOverlay(false);
    } catch (err) {
      console.error("Error saving category:", err);
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
              refetch();
            }}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            disabled={isLoading}
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

      {isLoading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : error ? (
        <div className="text-destructive text-center py-8">
          فشل في تحميل الفئات
        </div>
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
          isLoading={
            createMutation.isPending ||
            updateMutation.isPending
          }
        />
      )}
    </div>
  );
}
