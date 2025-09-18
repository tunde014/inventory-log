import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

interface Asset {
  id: string;
  name: string;
  status: "available" | "taken" | "damaged" | "missing";
  // ...other fields
}

interface InventoryReportProps {
  assets: Asset[];
}

export const InventoryReport: React.FC<InventoryReportProps> = ({ assets }) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(assets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "inventory-report.xlsx");
  };

  return (
    <Button onClick={exportToExcel} variant="outline">
      Export as Excel
    </Button>
  );
};