import CustomersHeader from "./components/CustomersHeader";
import CustomersFilters from "./components/CustomersFilters";
import CustomersTable from "./components/CustomersTable";

const customers = [
  {
    id: 1,
    name: "علي محمد",
    age: 34,
    phone: "(555) 123-4567",
    email: "ali.m@email.com",
    lastVisit: "منذ يومين",
    condition: "ربو مزمن",
    status: "نشط",
  },
  {
    id: 2,
    name: "أحمد محمود",
    age: 52,
    phone: "(555) 987-6543",
    email: "ahmed.m@email.com",
    lastVisit: "منذ أسبوع",
    condition: "ارتفاع ضغط الدم",
    status: "نشط",
  },
  {
    id: 3,
    name: "سارة خالد",
    age: 28,
    phone: "(555) 456-7890",
    email: "sara.k@email.com",
    lastVisit: "منذ 3 أسابيع",
    condition: "لا يوجد",
    status: "غير نشط",
  },
  {
    id: 4,
    name: "محمد حسن",
    age: 45,
    phone: "(555) 234-5678",
    email: "mohamed.h@email.com",
    lastVisit: "أمس",
    condition: "سكري النوع الثاني",
    status: "نشط",
  },
  {
    id: 5,
    name: "ليلى يوسف",
    age: 67,
    phone: "(555) 876-5432",
    email: "layla.y@email.com",
    lastVisit: "اليوم",
    condition: "التهاب المفاصل",
    status: "نشط",
  },
  {
    id: 6,
    name: "جاسم عبدالله",
    age: 41,
    phone: "(555) 345-6789",
    email: "jasim.a@email.com",
    lastVisit: "منذ شهر",
    condition: "لا يوجد",
    status: "غير نشط",
  },
];

export default function Customers() {
  return (
    <div className="space-y-6" dir="rtl">
      <CustomersHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <CustomersFilters />
        <CustomersTable data={customers} />
      </div>
    </div>
  );
}
