import { MedicineUnit } from "@/types";
import { Badge } from "@/ui/badge";

import { unitBadgeConfig } from "./medicineUnitConfig";

interface GetBadgeProp {
  unit?: MedicineUnit | null;
}

export default function MedicineUnitBadge({ unit }: GetBadgeProp) {
  if (!unit) return <Badge variant="secondary">غير معروف</Badge>;

  const { label, className } = unitBadgeConfig[unit];
  return <Badge className={className}>{label}</Badge>;
}
