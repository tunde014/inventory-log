import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

interface BulkImportAssetsProps {
  onImport: (assets: any[]) => void;
}

export const BulkImportAssets: React.FC<BulkImportAssetsProps> = ({ onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      onImport(json);
    };
    reader.readAsBinaryString(file);
    // Reset input so the same file can be selected again if needed
    e.target.value = "";
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Button onClick={handleButtonClick} variant="outline">
        Import Assets
      </Button>
    </>
  );
};