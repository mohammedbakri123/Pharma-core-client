import { TableCell, TableRow } from "@/ui/table";
import { Badge } from "@/ui/badge";
import {
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";

export default function InventoryRow({ item }: any) {
  return (
    <TableRow className="hover:bg-muted/50 transition-colors text-right">
      <TableCell className="font-mono text-xs text-muted-foreground">
        {item.sku}
      </TableCell>

      <TableCell className="font-medium">{item.name}</TableCell>

      <TableCell>
        <Badge variant="secondary" className="font-normal">
          {item.category}
        </Badge>
      </TableCell>

      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">{item.stock}</span>
          <span className="text-[10px] text-muted-foreground">
            الحد الأدنى: {item.minLevel}
          </span>
        </div>
      </TableCell>

      <TableCell>{item.price.toFixed(2)} ر.س</TableCell>

      <TableCell className="text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {item.expiry}
        </div>
      </TableCell>

      <TableCell>
        <Badge
          className={
            item.status === "متوفر"
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 border-green-200"
              : item.status === "مخزون منخفض"
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-100 border-yellow-200"
              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 border-red-200"
          }
        >
          {item.status === "متوفر" ? (
            <CheckCircle2 className="w-3 h-3 ml-1" />
          ) : (
            <AlertCircle className="w-3 h-3 ml-1" />
          )}
          {item.status}
        </Badge>
      </TableCell>

      <TableCell className="text-left">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuLabel className="text-right">
              الإجراءات
            </DropdownMenuLabel>

            <DropdownMenuItem className="text-right">
              تعديل التفاصيل
            </DropdownMenuItem>

            <DropdownMenuItem className="text-right">
              تحديث المخزون
            </DropdownMenuItem>

            <DropdownMenuItem className="text-right">
              عرض السجل
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive text-right">
              حذف الصنف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
