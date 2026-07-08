import { CardContent } from "@/ui/card";
import { useSearchParams } from "react-router-dom";
import { usePaymentsOverview } from "../../common/hooks/usePayments";
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

function getFilters(searchParams: URLSearchParams): PaymentsQueryParams {
  return {
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "10"),
    ...(searchParams.get("type")
      ? { type: searchParams.get("type") as PaymentType }
      : {}),
    ...(searchParams.get("method")
      ? { method: searchParams.get("method") as PaymentMethod }
      : {}),
    ...(searchParams.get("referenceType")
      ? {
          referenceType: searchParams.get(
            "referenceType",
          ) as PaymentReferenceType,
        }
      : {}),
    ...(searchParams.get("from") ? { from: searchParams.get("from")! } : {}),
    ...(searchParams.get("to") ? { to: searchParams.get("to")! } : {}),
  };
}

export default function PaymentsSummaryCards() {
  const [searchParams] = useSearchParams();
  const { data } = usePaymentsOverview(getFilters(searchParams));
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
