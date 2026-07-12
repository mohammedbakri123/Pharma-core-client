import { CardContent } from "@/ui/card";
import { useSearchParams } from "react-router-dom";
import {
  useGetFilters,
  usePaymentsOverview,
} from "../../common/hooks/usePayments";
import {
  Banknote,
  Calculator,
  CreditCard,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type React from "react";
import {
  PaymentMethod,
  PaymentReferenceType,
  PaymentType,
  type PaymentsQueryParams,
} from "@/types";
import { SummaryTile } from "./PaymentSummaryTile";

export default function PaymentsSummaryCards() {
  const [searchParams] = useSearchParams();
  const { data } = usePaymentsOverview(useGetFilters(searchParams));
  const summary = data?.summary;

  return (
    <CardContent className="pt-6 pb-0">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <SummaryTile
          label="إجمالي القبض"
          value={summary?.totalIn}
          Icon={TrendingUp}
          tone="in"
        />
        <SummaryTile
          label="إجمالي الصرف"
          value={summary?.totalOut}
          Icon={TrendingDown}
          tone="out"
        />
        <SummaryTile label="الصافي" value={summary?.net} Icon={Calculator} />
        <SummaryTile
          label="صافي النقد"
          value={summary?.cash.net}
          Icon={Banknote}
        />
        <SummaryTile
          label="صافي البطاقة"
          value={summary?.card.net}
          Icon={CreditCard}
        />
      </div>
    </CardContent>
  );
}
