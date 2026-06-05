import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePharmacyInfo } from "../hooks/useSettings";
import { Save, RefreshCw, Landmark, Phone, Mail, FileText, MapPin } from "lucide-react";

const infoSchema = z.object({
  name: z.string().min(3, "اسم الصيدلية يجب أن لا يقل عن 3 أحرف"),
  license: z.string().min(1, "رقم الترخيص مطلوب"),
  address: z.string().min(5, "العنوان يجب أن لا يقل عن 5 أحرف"),
  phone: z.string().min(5, "رقم الهاتف غير صالح"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  taxNumber: z.string().min(5, "الرقم الضريبي غير صالح"),
});

type InfoFormValues = z.infer<typeof infoSchema>;

export default function PharmacyInfoForm() {
  const { toast } = useToast();
  const { info, save, isSaving } = usePharmacyInfo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<InfoFormValues>({
    resolver: zodResolver(infoSchema),
    defaultValues: info,
  });

  useEffect(() => {
    reset(info);
  }, [info, reset]);

  const onSubmit = async (data: InfoFormValues) => {
    try {
      await save(data);
      toast({
        title: "تم حفظ معلومات الصيدلية",
        description: "تم تحديث البيانات العامة بنجاح وسوف تظهر في الفواتير المطبوعة.",
      });
      reset(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في الحفظ",
        description: "فشل حفظ البيانات العامة.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-right">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pharmacy Name */}
        <div className="space-y-2">
          <Label htmlFor="name">اسم الصيدلية</Label>
          <div className="relative">
            <Input
              id="name"
              {...register("name")}
              className="pr-10 text-right bg-background focus-visible:ring-primary/30"
              placeholder="مثال: صيدلية الأمل"
            />
            <Landmark className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* License Number */}
        <div className="space-y-2">
          <Label htmlFor="license">رقم الترخيص</Label>
          <div className="relative">
            <Input
              id="license"
              {...register("license")}
              className="pr-10 text-right bg-muted text-muted-foreground cursor-not-allowed"
              disabled
            />
            <FileText className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.license && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.license.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف للاتصال</Label>
          <div className="relative">
            <Input
              id="phone"
              {...register("phone")}
              className="pr-10 text-right bg-background focus-visible:ring-primary/30"
              placeholder="+966 5x xxx xxxx"
            />
            <Phone className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="pr-10 text-right bg-background focus-visible:ring-primary/30"
              placeholder="contact@pharmacy.com"
            />
            <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tax Number */}
        <div className="space-y-2">
          <Label htmlFor="taxNumber">الرقم الضريبي (VAT)</Label>
          <div className="relative">
            <Input
              id="taxNumber"
              {...register("taxNumber")}
              className="pr-10 text-right bg-background focus-visible:ring-primary/30"
              placeholder="15 خانة ضريبية"
            />
            <FileText className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.taxNumber && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.taxNumber.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">العنوان</Label>
          <div className="relative">
            <Input
              id="address"
              {...register("address")}
              className="pr-10 text-right bg-background focus-visible:ring-primary/30"
              placeholder="العنوان الكامل للفرع"
            />
            <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.address && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.address.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-start pt-2 border-t border-border/40">
        <Button 
          type="submit" 
          disabled={isSaving || !isDirty}
          className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 transition-all duration-200"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin ml-1.5" />
          ) : (
            <Save className="w-4 h-4 ml-1.5" />
          )}
          حفظ التغييرات
        </Button>
      </div>
    </form>
  );
}
