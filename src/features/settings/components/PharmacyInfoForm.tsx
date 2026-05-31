import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

export default function PharmacyInfoForm() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
        <div className="space-y-2">
          <Label htmlFor="name">اسم الصيدلية</Label>
          <Input
            id="name"
            defaultValue="فارماكور المركزية"
            className="text-right"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license">رقم الترخيص</Label>
          <Input
            id="license"
            defaultValue="PH-8829-NYC"
            disabled
            className="text-right"
          />
        </div>
      </div>

      <div className="space-y-2 text-right">
        <Label htmlFor="address">العنوان</Label>
        <Input
          id="address"
          defaultValue="123 مجمع المدينة الطبي"
          className="text-right"
        />
      </div>

      <div className="flex justify-start">
        <Button>حفظ التغييرات</Button>
      </div>
    </>
  );
}
