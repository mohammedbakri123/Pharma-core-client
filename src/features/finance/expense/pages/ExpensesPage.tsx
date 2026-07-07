import { Card } from "@/ui/card";
import ExpensesHeader from "../components/ExpensesHeader";
import ExpensesTable from "../components/ExpensesTable";
import ExpensesFooter from "../components/ExpensesFooter";

export default function ExpensesPage() {
  return (
    <Card>
      <ExpensesHeader />
      <ExpensesTable />
      <ExpensesFooter />
    </Card>
  );
}
