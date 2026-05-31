import MetricCard from "./MetricCard";
import { DollarSign, Package, AlertTriangle, Users } from "lucide-react";

export default function MetricsGrid({ metrics }: any) {
  const metricIcons = [DollarSign, Package, AlertTriangle, Users];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric: any, index: number) => {
        const Icon = metricIcons[index] ?? DollarSign;

        return <MetricCard key={metric.label} metric={metric} Icon={Icon} />;
      })}
    </div>
  );
}
