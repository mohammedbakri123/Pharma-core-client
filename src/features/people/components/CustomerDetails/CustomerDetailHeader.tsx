import type { CustomerDto } from "@/types";
import { ArrowRight, Phone, MapPin, Calendar, FileText } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { Button } from "@/ui/button";

interface CustomerDetailHeaderProps {
  customer: CustomerDto;
  onBack: () => void;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
}

export default function CustomerDetailHeader({
  customer,
  onBack,
}: CustomerDetailHeaderProps) {
  return (
    <>
      <div className="h-1.5 bg-linear-to-l from-primary via-primary/60 to-primary/20" />

      <div className="p-6 bg-linear-to-br from-primary/10 via-primary/5 to-background border-b border-border/40">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 -mr-2 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          العودة إلى العملاء
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-linear-to-tr from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md border border-primary/20 select-none">
              {getInitials(customer.name)}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-foreground">
                {customer.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                رقم العميل: #{customer.customerId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 text-xs text-muted-foreground w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-border/40">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>{customer.phoneNumber || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span
                className="truncate max-w-50"
                title={customer.address || ""}
              >
                {customer.address || "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>عضو منذ: {formatDate(customer.createdAt)}</span>
            </div>
          </div>
        </div>

        {customer.note && (
          <div className="mt-4 p-3 bg-background/50 border border-border/40 rounded-lg flex items-start gap-2 text-xs text-muted-foreground">
            <FileText className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">{customer.note}</p>
          </div>
        )}
      </div>
    </>
  );
}
