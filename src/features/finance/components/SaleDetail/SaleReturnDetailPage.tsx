import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { Spinner } from "@/ui/spinner";
import { Badge } from "@/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/dialog";
import { ConfirmDialog } from "@/ui/confirm-dialog";
import {
  RotateCcw,
  ArrowRight,
  CheckCircle,
  Ban,
  Trash2,
  User,
  Calendar,
  Package,
  FileText,
} from "lucide-react";
import {
  useSaleReturnById,
  useAddSaleReturnItem,
  useUpdateSaleReturnItem,
  useDeleteSaleReturnItem,
  useCompleteSaleReturn,
  useCancelSaleReturn,
  useDeleteSaleReturn,
} from "../../hooks/useSalesReturns";
import { SalesReturnStatus } from "@/types";
import type { SalesReturnDetailsDto } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/utils/formatters";
import SaleReturnInfoCards from "./SaleReturnInfoCards";
import SaleReturnItemsTable from "./SaleReturnItemsTable";

const statusConfig: Record<SalesReturnStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  [SalesReturnStatus.Draft]: { label: "مسودة", variant: "secondary" },
  [SalesReturnStatus.Completed]: { label: "مكتمل", variant: "default" },
  [SalesReturnStatus.Cancelled]: { label: "ملغي", variant: "destructive" },
};

export default function SaleReturnDetailPage() {
  const { id, returnId } = useParams<{ id: string; returnId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const saleId = Number(id);
  const rId = Number(returnId);

  const { data: returnData, isLoading, isError, refetch } = useSaleReturnById(saleId, rId);

  const { mutate: addItem, isPending: isAddingItem } = useAddSaleReturnItem(saleId, rId);
  const { mutate: updateItem, isPending: isUpdatingItem } = useUpdateSaleReturnItem(saleId, rId);
  const { mutate: deleteItem, isPending: isDeletingItem } = useDeleteSaleReturnItem(saleId, rId);
  const { mutate: completeReturn, isPending: isCompleting } = useCompleteSaleReturn(saleId);
  const { mutate: cancelReturn, isPending: isCancelling } = useCancelSaleReturn(saleId);
  const { mutate: deleteReturn, isPending: isDeletingReturn } = useDeleteSaleReturn(saleId);

  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteReturnDialogOpen, setDeleteReturnDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-muted-foreground text-sm">جاري تحميل بيانات المرتجع...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !returnData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
          <Ban className="w-12 h-12 text-destructive" />
          <p className="text-destructive font-medium">فشل تحميل بيانات المرتجع</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer">
              إعادة المحاولة
            </Button>
            <Button variant="default" size="sm" onClick={() => navigate(`/finance/sales/${saleId}`)} className="cursor-pointer">
              العودة
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const returnStatus = returnData.status;
  const isDraft = returnStatus !== SalesReturnStatus.Completed && returnStatus !== SalesReturnStatus.Cancelled;
  const statusInfo = returnStatus ? (statusConfig[returnStatus] ?? { label: "غير معروف", variant: "outline" as const }) : { label: "مسودة", variant: "secondary" as const };
  const items = returnData.items || [];

  const handleCompleteReturn = () => {
    completeReturn(rId, {
      onSuccess: () => {
        setCompleteDialogOpen(false);
        toast({ title: "تم إتمام المرتجع بنجاح", description: "تم إتمام المرتجع وتحديث المخزون بنجاح.", variant: "success" });
      },
      onError: () => {
        toast({ title: "فشل إتمام المرتجع", description: "حدث خطأ أثناء إتمام المرتجع.", variant: "destructive" });
      },
    });
  };

  const handleCancelReturn = () => {
    cancelReturn(rId, {
      onSuccess: () => {
        setCancelDialogOpen(false);
        toast({ title: "تم إلغاء المرتجع بنجاح", description: "تم إلغاء المرتجع بنجاح.", variant: "success" });
      },
      onError: () => {
        toast({ title: "فشل إلغاء المرتجع", description: "حدث خطأ أثناء إلغاء المرتجع.", variant: "destructive" });
      },
    });
  };

  const handleDeleteReturn = () => {
    deleteReturn(rId, {
      onSuccess: () => {
        setDeleteReturnDialogOpen(false);
        toast({ title: "تم حذف المرتجع بنجاح", description: "تم حذف المرتجع بنجاح.", variant: "success" });
        navigate(`/finance/sales/${saleId}`);
      },
      onError: () => {
        toast({ title: "فشل حذف المرتجع", description: "حدث خطأ أثناء حذف المرتجع.", variant: "destructive" });
      },
    });
  };

  return (
    <Card className="overflow-hidden dir-rtl">
      <div className="p-6 bg-linear-to-br from-primary/10 via-primary/5 to-background border-b border-border/40">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/finance/sales/${saleId}`)}
          className="mb-4 -mr-2 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          العودة إلى الفاتورة
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-linear-to-tr from-primary to-primary/70 text-primary-foreground flex items-center justify-center shrink-0 shadow-md border border-primary/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  مرتجع #{rId}
                </h1>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {returnData.customerName && `العميل: ${returnData.customerName}`}
                {returnData.customerName && returnData.userName && " | "}
                {returnData.userName && `بواسطة: ${returnData.userName}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <SaleReturnInfoCards returnData={returnData} />

        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={() => setCompleteDialogOpen(true)} className="gap-1 cursor-pointer">
            <CheckCircle className="w-4 h-4" />
            إتمام المرتجع
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCancelDialogOpen(true)} className="gap-1 text-destructive border-destructive/30 hover:text-destructive cursor-pointer">
            <Ban className="w-4 h-4" />
            إلغاء المرتجع
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDeleteReturnDialogOpen(true)} className="gap-1 text-destructive border-destructive/30 hover:text-destructive cursor-pointer mr-auto">
            <Trash2 className="w-4 h-4" />
            حذف المرتجع
          </Button>
        </div>

        <SaleReturnItemsTable
          items={items}
          onAddItem={(data) => addItem(data, {
            onSuccess: () => toast({ title: "تمت إضافة الصنف بنجاح", description: "تمت إضافة الصنف إلى المرتجع بنجاح.", variant: "success" }),
            onError: () => toast({ title: "فشل إضافة الصنف", description: "حدث خطأ أثناء إضافة الصنف إلى المرتجع.", variant: "destructive" }),
          })}
          onUpdateItem={(args) => updateItem(args, {
            onSuccess: () => toast({ title: "تم تحديث الصنف بنجاح", description: "تم تحديث كمية الصنف في المرتجع بنجاح.", variant: "success" }),
            onError: () => toast({ title: "فشل تحديث الصنف", description: "حدث خطأ أثناء تحديث بيانات الصنف.", variant: "destructive" }),
          })}
          onDeleteItem={(itemId) => deleteItem(itemId, {
            onSuccess: () => toast({ title: "تم حذف الصنف بنجاح", description: "تم حذف الصنف من المرتجع بنجاح.", variant: "success" }),
            onError: () => toast({ title: "فشل حذف الصنف", description: "حدث خطأ أثناء حذف الصنف من المرتجع.", variant: "destructive" }),
          })}
          isAddingItem={isAddingItem}
          isUpdatingItem={isUpdatingItem}
          isDeletingItem={isDeletingItem}
        />
      </div>

      {/* Complete Return Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              إتمام المرتجع
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {returnData.customerName && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  العميل
                </span>
                <span className="text-sm font-medium">{returnData.customerName}</span>
              </div>
            )}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                عدد الأصناف
              </span>
              <span className="text-sm font-medium">{items.length}</span>
            </div>
            {returnData.note && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  ملاحظة
                </span>
                <span className="text-sm font-medium">{returnData.note}</span>
              </div>
            )}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                تاريخ الإنشاء
              </span>
              <span className="text-sm font-medium">{formatDate(returnData.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">الإجمالي</span>
              <span className="text-lg font-bold text-primary">{formatCurrency(returnData.totalAmount)} ريال</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCompleteReturn} disabled={isCompleting} className="cursor-pointer">
              {isCompleting ? "جاري الإتمام..." : "إتمام المرتجع"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirm */}
      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="إلغاء المرتجع"
        description="هل أنت متأكد من إلغاء هذا المرتجع؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="إلغاء المرتجع"
        cancelLabel="تراجع"
        variant="destructive"
        onConfirm={handleCancelReturn}
        isPending={isCancelling}
      />

      {/* Delete Return Confirm */}
      <ConfirmDialog
        open={deleteReturnDialogOpen}
        onOpenChange={setDeleteReturnDialogOpen}
        title="حذف المرتجع"
        description="هل أنت متأكد من حذف هذا المرتجع؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="destructive"
        onConfirm={handleDeleteReturn}
        isPending={isDeletingReturn}
      />
    </Card>
  );
}
