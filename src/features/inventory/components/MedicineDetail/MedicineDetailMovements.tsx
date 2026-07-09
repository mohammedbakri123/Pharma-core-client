import { useParams, useSearchParams } from "react-router-dom";
import { useMedicineMovements } from "../../hooks/useMedicine";
import { MedicineDetailMovementsTable } from "./MedicineDetailMovementsTable";
import { Spinner } from "@/ui/spinner";
import { Pagination } from "@/ui/pagination";
import { History } from "lucide-react";

export default function MedicineDetailMovements() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const medicineId = Number(id);
  const { data, isLoading, isError, refetch } = useMedicineMovements(medicineId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <p className="text-destructive font-medium">فشل تحميل حركات المخزون</p>
        <button
          onClick={() => refetch()}
          className="text-sm text-primary hover:underline cursor-pointer"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const movements = data?.items || [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          إجمالي {pagination?.total || 0} حركة
        </h3>
        <h3 className="font-semibold text-base flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          حركات المخزون
        </h3>
      </div>

      <MedicineDetailMovementsTable movements={movements} />

      {pagination && (
        <div className="mt-4">
          <Pagination
            limit={pagination.limit}
            total={pagination.total}
          />
        </div>
      )}
    </div>
  );
}