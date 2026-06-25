import { useParams } from "react-router-dom";
import CustomerSales from "./sales/CustomerSales";

export default function CustomerSalesTab() {
  const { id } = useParams<{ id: string }>();
  const customerId = Number(id);
  return <CustomerSales customerId={customerId} />;
}
