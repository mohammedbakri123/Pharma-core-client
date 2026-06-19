import { Card } from "@/ui/card";
import CustomersHeader from "../components/Customers/CustomersHeader";
import CustomersTable from "../components/Customers/CustomersTable";

export default function CustomersPage() {
  return (
    <Card>
      <CustomersHeader />
      <CustomersTable />
    </Card>
  );
}
