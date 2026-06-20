import { Card } from "@/ui/card";
import SuppliersHeader from "../components/Suppliers/SuppliersHeader";
import SuppliersTable from "../components/Suppliers/SuppliersTable";
import SuppliersFooter from "../components/Suppliers/SuppliersFooter";

export default function SuppliersPage() {
  return (
    <Card>
      <SuppliersHeader />
      <SuppliersTable />
      <SuppliersFooter />
    </Card>
  );
}
