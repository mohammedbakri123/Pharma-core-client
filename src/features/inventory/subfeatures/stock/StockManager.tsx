import { useState } from "react";
import { getStock } from "@/api/inventory";
import InventoryToolbar from "../../components/InventoryToolbar";
import InventoryTable from "../../components/InventoryTable";

export default function StockManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implement useEffect to fetch stock
  // useEffect(() => {
  //   fetchStock();
  // }, []);

  const filteredItems = stockItems.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {loading ? (
        <div className="p-6 text-center">جاري تحميل المخزون...</div>
      ) : error ? (
        <div className="p-6 text-destructive text-center">{error}</div>
      ) : (
        <>
          <InventoryToolbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <InventoryTable data={filteredItems} />
        </>
      )}
    </>
  );
}
