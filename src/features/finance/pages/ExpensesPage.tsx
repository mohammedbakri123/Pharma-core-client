import { Card } from "@/ui/card";
import ExpensesHeader from "../components/Expenses/ExpensesHeader";
import ExpensesTable from "../components/Expenses/ExpensesTable";
import ExpensesFooter from "../components/Expenses/ExpensesFooter";

export default function ExpensesPage() {
  return (
    <Card>
      <ExpensesHeader />
      <ExpensesTable />
      <ExpensesFooter />
    </Card>
  );
}
