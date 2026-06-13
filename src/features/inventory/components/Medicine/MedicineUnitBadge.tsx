import { MedicineUnit } from "@/types";
import { Badge } from "@/ui/badge";

interface GetBadgeProp {
  unit?: MedicineUnit | null;
}

const unitConfig: Record<
  MedicineUnit,
  { label: string; className: string }
> = {
  [MedicineUnit.Box]: { label: "علبة", className: "bg-blue-600 hover:bg-blue-600/95 text-white" },
  [MedicineUnit.Ampoule]: { label: "امبول", className: "bg-rose-600 hover:bg-rose-600/95 text-white" },
  [MedicineUnit.Bottle]: { label: "قارورة", className: "bg-purple-600 hover:bg-purple-600/95 text-white" },
  [MedicineUnit.Inhaler]: { label: "انهيلر", className: "bg-cyan-600 hover:bg-cyan-600/95 text-white" },
  [MedicineUnit.Patch]: { label: "باتش", className: "bg-lime-600 hover:bg-lime-600/95 text-white" },
  [MedicineUnit.Pill]: { label: "حبة", className: "bg-amber-600 hover:bg-amber-600/95 text-white" },
  [MedicineUnit.Sachet]: { label: "ساتشت", className: "bg-pink-600 hover:bg-pink-600/95 text-white" },
  [MedicineUnit.Strip]: { label: "ستريب", className: "bg-emerald-600 hover:bg-emerald-600/95 text-white" },
  [MedicineUnit.Tube]: { label: "تيوب", className: "bg-orange-600 hover:bg-orange-600/95 text-white" },
  [MedicineUnit.Vial]: { label: "فيال", className: "bg-teal-600 hover:bg-teal-600/95 text-white" },
};

export default function MedicineUnitBadge({ unit }: GetBadgeProp) {
  if (!unit) return <Badge variant="secondary">غير معروف</Badge>;

  const { label, className } = unitConfig[unit];
  return <Badge className={className}>{label}</Badge>;
}
