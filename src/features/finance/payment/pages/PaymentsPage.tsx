import { Card } from "@/ui/card";
import PaymentsHeader from "../components/PaymentsHeader";
import PaymentsTable from "../components/PaymentsTable";

export default function PaymentsPage() {
  return (
    <Card>
      <PaymentsHeader />
      <PaymentsTable />
    </Card>
  );
}
