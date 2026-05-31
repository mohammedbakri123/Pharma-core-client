import type { CategoryDto } from "../types";

interface CategoryTableProps {
  categories: CategoryDto[];
  onEdit?: (category: CategoryDto) => void;
  onDelete?: (categoryId: number) => void;
  onRestore?: (categoryId: number) => void;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
  onRestore,
}: CategoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="p-4 text-right border-b">الرقم التعريفي</th>
            <th className="p-4 text-right border-b">الاسم</th>
            <th className="p-4 text-right border-b">الاسم العربي</th>
            <th className="p-4 text-right border-b">الحالة</th>
            <th className="p-4 text-right border-b">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.categoryId} className="border-b hover:bg-muted/50">
              <td className="p-4">{cat.categoryId}</td>
              <td className="p-4">{cat.categoryName}</td>
              <td className="p-4">{cat.categoryArabicName || "-"}</td>
              <td className="p-4">
                {cat.isDeleted ? (
                  <span className="text-destructive">محذوف</span>
                ) : (
                  <span className="text-green-600">نشط</span>
                )}
              </td>
              <td className="p-4 flex gap-2">
                {!cat.isDeleted && (
                  <>
                    <button
                      onClick={() => onEdit?.(cat)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => onDelete?.(cat.categoryId)}
                      className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                    >
                      حذف
                    </button>
                  </>
                )}
                {cat.isDeleted && (
                  <button
                    onClick={() => onRestore?.(cat.categoryId)}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    استعادة
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
