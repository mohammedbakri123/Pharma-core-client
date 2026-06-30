import { ArrowRight } from "lucide-react";
import React from "react";

import { Button } from "@/ui/button";
import { RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import SalesReturnStatusBadge from "./SalesReturnStatusBadge";
import { SalesReturnStatus } from "@/types";

interface SalesReturnHeaderProps {
  saleId: number;
  salesReturn: {
    salesReturnId: number;
    status?: SalesReturnStatus;
    createdAt?: string;
    userName?: string;
    items: any[];
  };
  isDraft: boolean;
  isCompleting: boolean;
  isCancelling: boolean;
  setCompleteDialogOpen: (open: boolean) => void;
  setCancelDialogOpen: (open: boolean) => void;
  onBack: () => void;
}

export default function SalesReturnHeader({
  saleId,
  salesReturn,
  isDraft,
  isCompleting,
  isCancelling,
  setCompleteDialogOpen,
  setCancelDialogOpen,
  onBack,
}: SalesReturnHeaderProps) {
  return (
    <div className="p-6 bg-linear-to-br from-primary/10 via-primary/5 to-background border-b border-border/40">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-4 -mr-2 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        العودة إلى المرتجعات
      </Button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-linear-to-tr from-primary to-primary/70 text-primary-foreground flex items-center justify-center shrink-0 shadow-md border border-primary/20">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">
                تفاصيل المرتجع #{salesReturn.salesReturnId}
              </h1>
              <SalesReturnStatusBadge
                status={salesReturn.status ?? SalesReturnStatus.Draft}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              المرتجع تابع للفاتورة الأصليّة #{saleId}
              {salesReturn.createdAt &&
                ` | تاريخ المرتجع: ${formatDate(salesReturn.createdAt)}`}
              {salesReturn.userName && ` | بواسطة: ${salesReturn.userName}`}
            </p>
          </div>
        </div>

        {isDraft && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelDialogOpen(true)}
              className="text-destructive hover:bg-destructive/10 cursor-pointer"
              disabled={isCancelling}
            >
              <XCircle className="w-4 h-4 ml-1" />
              إلغاء المرتجع
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setCompleteDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              disabled={isCompleting || salesReturn.items.length === 0}
            >
              <CheckCircle className="w-4 h-4 ml-1" />
              إكمال المرتجع
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
