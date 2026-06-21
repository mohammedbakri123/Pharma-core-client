import { Badge } from "@/ui/badge";
import { statementTypeBadgeConfig } from "./statementTypeBadgeConfig";

interface StatementTypeBadgeProps {
  type: string;
}

export default function StatementTypeBadge({ type }: StatementTypeBadgeProps) {
  const config = statementTypeBadgeConfig[type.toLowerCase()];
  if (!config) return <Badge variant="secondary">{type}</Badge>;
  return <Badge className={config.className}>{config.label}</Badge>;
}
