import { Card } from "@/ui/card";
import CustomersHeader from "../components/Customers/CustomersHeader";
import CustomersTable from "../components/Customers/CustomersTable";
import CustomersFooter from "../components/Customers/CustomersFooter";

export default function CustomersPage() {
  return (
    <Card>
      <CustomersHeader />
      <CustomersTable />
      <CustomersFooter />
    </Card>
  );
}
