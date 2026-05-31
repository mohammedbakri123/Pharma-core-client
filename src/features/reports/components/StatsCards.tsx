import { Card, CardContent } from "@/ui/card";

export default function StatsCards({ stats }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat: any, i: number) => {
        const Icon = stat.icon;

        return (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>

              <Icon className={`w-8 h-8 ${stat.color} opacity-20`} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
