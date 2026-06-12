import { Card } from "@/ui/card";
import React from "react";
import MedicineHeader from "./MedicineHeader";
import MedicineTable from "./MedicineTable";
import MedicineFooter from "./MedicineFooter";

export default function Medicine() {
  return (
    <Card>
      <MedicineHeader />
      <MedicineTable />
      <MedicineFooter />
    </Card>
  );
}
