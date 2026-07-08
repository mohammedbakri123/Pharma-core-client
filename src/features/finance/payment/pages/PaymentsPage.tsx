import { Card } from "@/ui/card";
import PaymentsHeader from "../components/PaymentsHeader";
import PaymentsSummaryCards from "../components/PaymentsSummaryCards";
import PaymentsTable from "../components/PaymentsTable";

export default function PaymentsPage() {
  return (
    <Card>
      <PaymentsHeader />
      <PaymentsSummaryCards />
      <PaymentsTable />
    </Card>
  );
}
