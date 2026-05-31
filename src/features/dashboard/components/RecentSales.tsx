import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";

export default function RecentSales({ sales }: any) {
  return (
    <Card className="col-span-1 lg:col-span-3 shadow-sm">
      <CardHeader>
        <CardTitle>أحدث المعاملات</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {sales.map((sale: any, i: number) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {sale.patient.charAt(0)}
                </div>

                <div className="space-y-1 text-right">
                  <p className="text-sm font-medium leading-none">
                    {sale.patient}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sale.id} • {sale.time}
                  </p>
                </div>
              </div>

              <div className="text-left">
                <p className="text-sm font-bold">{sale.amount}</p>
                <Badge
                  variant={
                    sale.status === "مكتمل"
                      ? "default"
                      : sale.status === "قيد الانتظار"
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-[10px] h-5 px-1.5"
                >
                  {sale.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
