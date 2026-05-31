import InvoicesHeader from "./components/InvoicesHeader";
import InvoicesTable from "./components/InvoicesTable";

export default function Invoices() {
  const invoices = [
    {
      id: "INV-2024-001",
      patient: "علي محمد",
      date: "2024-01-20",
      amount: "150.00 ر.س",
      status: "مدفوعة",
    },
    {
      id: "INV-2024-002",
      patient: "أحمد محمود",
      date: "2024-01-21",
      amount: "45.00 ر.س",
      status: "مدفوعة",
    },
    {
      id: "INV-2024-003",
      patient: "سارة خالد",
      date: "2024-01-21",
      amount: "210.20 ر.س",
      status: "مسودة",
    },
    {
      id: "INV-2024-004",
      patient: "محمد حسن",
      date: "2024-01-22",
      amount: "85.00 ر.س",
      status: "مدفوعة",
    },
  ];

  return (
    <div className="space-y-6">
      <InvoicesHeader />
      <InvoicesTable data={invoices} />
    </div>
  );
}
