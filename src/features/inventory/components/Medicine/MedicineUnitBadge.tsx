import { MedicineUnit } from "@/types";
import { Badge } from "@/ui/badge";

interface GetBadgeProp {
  unit?: MedicineUnit | null;
}

//TODO: this is shit i know but we should do it

export default function MedicineUnitBadge({ unit }: GetBadgeProp) {
  switch (unit) {
    case MedicineUnit.Box:
      return (
        <Badge className="bg-primary hover:bg-primary/95 text-white">
          علبة
        </Badge>
      );

    case MedicineUnit.Ampoule:
      return (
        <Badge className="bg-primary hover:bg-primary/95 text-white">
          امبول
        </Badge>
      );
    case MedicineUnit.Bottle:
      return (
        <Badge className="bg-primary hover:bg-primary/95 text-white">
          قارورة
        </Badge>
      );
    case MedicineUnit.Inhaler:
      return (
        <Badge className="bg-primary hover:bg-primary/95 text-white">
          انهيلر
        </Badge>
      );
    case MedicineUnit.Patch:
      return (
        <Badge className="bg-primary hover:bg-primary/95 text-white">
          باتش
        </Badge>
      );
    case MedicineUnit.Pill:
      return (
        <Badge className="bg-primary hover:bg-primary/95 text-white">حبة</Badge>
      );
    case MedicineUnit.Sachet:
      return (
        <Badge className="bg-primary hover:bg-primary/95 text-white">
          ساتشت
        </Badge>
      );
    case MedicineUnit.Strip:
      return (
        <Badge className="bg-primary hover:bg-primary/95 text-white">
          ستريب
        </Badge>
      );
    case MedicineUnit.Tube:
      return (
        <Badge className="bg-primary hover:bg-primary/95 text-white">
          تيوب
        </Badge>
      );
    case MedicineUnit.Vial:
      return (
        <Badge className="bg-primary hover:bg-primary/95 text-white">
          فيال
        </Badge>
      );

    default:
      return <Badge variant="secondary">غير معروف</Badge>;
  }
}
