import { Card } from "@/ui/card";
import SuppliersHeader from "../components/Suppliers/SuppliersHeader";
import SuppliersTable from "../components/Suppliers/SuppliersTable";

export default function SuppliersPage() {
  return (
    <Card>
      <SuppliersHeader />
      <SuppliersTable />
    </Card>
  );
}
