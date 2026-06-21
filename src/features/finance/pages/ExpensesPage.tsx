import { Card } from "@/ui/card";
import ExpensesHeader from "../components/Expenses/ExpensesHeader";
import ExpensesTable from "../components/Expenses/ExpensesTable";

export default function ExpensesPage() {
  return (
    <Card>
      <ExpensesHeader />
      <ExpensesTable />
    </Card>
  );
}
