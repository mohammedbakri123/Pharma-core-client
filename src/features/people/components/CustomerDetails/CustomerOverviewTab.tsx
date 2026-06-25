import { useParams } from "react-router-dom";
import CustomerOverview from "./overview/CustomerOverview";

export default function CustomerOverviewTab() {
  const { id } = useParams<{ id: string }>();
  const customerId = Number(id);
  return <CustomerOverview customerId={customerId} />;
}
