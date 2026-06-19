import { Card } from "@/ui/card";
import AdjustmentsHeader from "../components/Adjustments/AdjustmentsHeader";
import AdjustmentsTable from "../components/Adjustments/AdjustmentsTable";

export default function AdjustmentsPage() {
  return (
    <Card>
      <AdjustmentsHeader />
      <AdjustmentsTable />
    </Card>
  );
}
