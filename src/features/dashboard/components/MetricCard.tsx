import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({ metric, Icon }: any) {
  const TrendIcon =
    metric.trendDirection === "up"
      ? TrendingUp
      : metric.trendDirection === "down"
      ? TrendingDown
      : null;

  const trendClassName =
    metric.trendDirection === "up"
      ? "text-green-600"
      : metric.trendDirection === "down"
      ? "text-red-500"
      : "text-muted-foreground";

  return (
    <Card
      className={
        metric.trendDirection === "neutral"
          ? "hover:shadow-md transition-shadow duration-200 border-r-4 border-r-yellow-400"
          : "hover:shadow-md transition-shadow duration-200"
      }
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </CardTitle>
        <Icon
          className={
            metric.trendDirection === "neutral"
              ? "h-4 w-4 text-yellow-500"
              : "h-4 w-4 text-muted-foreground"
          }
        />
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">{metric.value}</div>
        <p className="mt-1 flex items-center text-xs text-muted-foreground">
          <span className={trendClassName + " ml-1 flex items-center"}>
            {TrendIcon ? <TrendIcon className="mr-0.5 h-3 w-3" /> : null}
          </span>
          {metric.trend}
        </p>
      </CardContent>
    </Card>
  );
}
