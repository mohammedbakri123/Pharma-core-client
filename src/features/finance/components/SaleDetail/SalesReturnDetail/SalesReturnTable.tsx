import { SalesReturnItemDto } from "@/types";
import { Button } from "@/ui/button";
import { DataTable } from "@/ui/data-table";
import { formatCurrency } from "@/utils/formatters";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";

interface props {
  isDraft: boolean;
  setEditingItem: (item: SalesReturnItemDto) => void;
  setDeletingItemId: (id: number) => void;
  items: SalesReturnItemDto[];
}

export default function SalesReturnTable({
  isDraft,
  setEditingItem,
  setDeletingItemId,
  items,
}: props) {
  const columns = [
    {
      key: "index",
      header: "#",
      className: "text-muted-foreground w-12",
      render: (_: SalesReturnItemDto, index: number) => index + 1,
    },
    {
      key: "medicineName",
      header: "اسم الصنف",
      render: (item: SalesReturnItemDto) => (
        <span className="font-medium">{item.medicineName || "غير محدد"}</span>
      ),
    },
    {
      key: "batchNumber",
      header: "رقم الباتش",
      render: (item: SalesReturnItemDto) => (
        <span className="text-muted-foreground">
          {item.batchNumber || "غير محدد"}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "الكمية المرتجعة",
      render: (item: SalesReturnItemDto) => (
        <span className="font-semibold">{item.quantity}</span>
      ),
    },
    {
      key: "unitPrice",
      header: "سعر الوحدة",
      className: "font-mono",
      render: (item: SalesReturnItemDto) => formatCurrency(item.unitPrice),
    },
    {
      key: "totalPrice",
      header: "الإجمالي",
      className: "font-mono font-semibold text-primary",
      render: (item: SalesReturnItemDto) => formatCurrency(item.totalPrice),
    },
    ...(isDraft
      ? [
          {
            key: "actions",
            header: "",
            className: "w-20 text-left",
            render: (item: SalesReturnItemDto) => (
              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                  onClick={() => setEditingItem(item)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                  onClick={() => setDeletingItemId(item.salesReturnItemId)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];
  return (
    <div>
      {/* Items Table */}
      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item.salesReturnItemId}
        emptyMessage="لم يتم إضافة أي صنف مرتجع حتى الآن"
      />
    </div>
  );
}
