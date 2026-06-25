import { useParams } from "react-router-dom";
import CustomerStatement from "./statement/CustomerStatement";

export default function CustomerStatementTab() {
  const { id } = useParams<{ id: string }>();
  const customerId = Number(id);
  return <CustomerStatement customerId={customerId} />;
}
