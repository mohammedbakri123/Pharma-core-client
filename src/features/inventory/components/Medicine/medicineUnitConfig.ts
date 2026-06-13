import { MedicineUnit } from "@/types";

export const unitLabels: Record<MedicineUnit, string> = {
  [MedicineUnit.Box]: "علبة",
  [MedicineUnit.Ampoule]: "أمبولة",
  [MedicineUnit.Bottle]: "زجاجة",
  [MedicineUnit.Inhaler]: "بخاخ",
  [MedicineUnit.Patch]: "لصقة",
  [MedicineUnit.Pill]: "قرص",
  [MedicineUnit.Sachet]: "كيس",
  [MedicineUnit.Strip]: "شريط",
  [MedicineUnit.Tube]: "أنبوب",
  [MedicineUnit.Vial]: "قارورة حقن",
};

export const unitBadgeConfig: Record<
  MedicineUnit,
  { label: string; className: string }
> = {
  [MedicineUnit.Box]: { label: "علبة", className: "bg-blue-600 hover:bg-blue-600/95 text-white" },
  [MedicineUnit.Ampoule]: { label: "أمبولة", className: "bg-rose-600 hover:bg-rose-600/95 text-white" },
  [MedicineUnit.Bottle]: { label: "زجاجة", className: "bg-purple-600 hover:bg-purple-600/95 text-white" },
  [MedicineUnit.Inhaler]: { label: "بخاخ", className: "bg-cyan-600 hover:bg-cyan-600/95 text-white" },
  [MedicineUnit.Patch]: { label: "لصقة", className: "bg-lime-600 hover:bg-lime-600/95 text-white" },
  [MedicineUnit.Pill]: { label: "قرص", className: "bg-amber-600 hover:bg-amber-600/95 text-white" },
  [MedicineUnit.Sachet]: { label: "كيس", className: "bg-pink-600 hover:bg-pink-600/95 text-white" },
  [MedicineUnit.Strip]: { label: "شريط", className: "bg-emerald-600 hover:bg-emerald-600/95 text-white" },
  [MedicineUnit.Tube]: { label: "أنبوب", className: "bg-orange-600 hover:bg-orange-600/95 text-white" },
  [MedicineUnit.Vial]: { label: "قارورة حقن", className: "bg-teal-600 hover:bg-teal-600/95 text-white" },
};
