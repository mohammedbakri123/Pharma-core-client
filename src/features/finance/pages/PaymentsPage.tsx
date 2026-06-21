import { Card } from "@/ui/card";
import PaymentsHeader from "../components/Payments/PaymentsHeader";
import PaymentsTable from "../components/Payments/PaymentsTable";

export default function PaymentsPage() {
  return (
    <Card>
      <PaymentsHeader />
      <PaymentsTable />
    </Card>
  );
}
