import { Card } from "@/ui/card";
import React from "react";
import MedicineHeader from "../components/Medicine/MedicineHeader";
import MedicineTable from "../components/Medicine/MedicineTable";
import MedicineFooter from "../components/Medicine/MedicineFooter";

export default function MedicinePage() {
  return (
    <Card>
      <MedicineHeader />
      <MedicineTable />
      <MedicineFooter />
    </Card>
  );
}
