import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function CategoryChart({ data, colors }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>توزيع المبيعات حسب الفئة</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_: any, index: number) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* legend */}
          <div className="space-y-2">
            {data.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
