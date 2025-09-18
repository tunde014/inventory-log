import { Waybill } from "@/types/asset";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface WaybillDocumentProps {
  waybill: Waybill;
  onClose: () => void;
}

export function WaybillDocument({ waybill, onClose }: WaybillDocumentProps) {
  const { companySettings } = useCompanySettings();

  const exportToPDF = async () => {
    const element = document.getElementById('waybill-document');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`waybill-${waybill.id}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-2xl font-bold">Waybill Document</h2>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={exportToPDF} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        </div>
      </div>

      <div id="waybill-document" className="bg-white p-8 min-h-[297mm] print:p-8 print:m-0">
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #waybill-document, #waybill-document * {
              visibility: visible;
            }
            #waybill-document {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}</style>

        {/* Company Logo */}
        {companySettings?.logoUrl && (
          <div className="text-center mb-6">
            <img 
              src={companySettings.logoUrl} 
              alt="Company Logo" 
              className="h-16 mx-auto"
            />
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
            WAYBILL
          </h1>
        </div>

        {/* Header Information */}
        <div className="mb-6 space-y-2" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt' }}>
          <div className="text-black">
            <strong>Date:</strong> {format(waybill.issueDate, 'dd MMMM yyyy')}
          </div>
          <div className="text-black">
            <strong>Driver's Name:</strong> {waybill.driverName}
          </div>
          <div className="text-black">
            <strong>Vehicle:</strong> {waybill.vehicle}
          </div>
        </div>

        {/* Project Description */}
        <div className="mb-6" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt' }}>
          <div className="text-black">
            <strong>Materials Waybill for {waybill.purpose}</strong>
          </div>
        </div>

        {/* Items List */}
        <div className="mb-8" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt' }}>
          <div className="space-y-2">
            {waybill.items.map((item, index) => (
              <div key={index} className="text-black">
                {index + 1}. {item.assetName} ({item.quantity})
              </div>
            ))}
          </div>
        </div>

        {/* Signature Line */}
        <div className="mb-8 mt-16" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt' }}>
          <div className="border-b border-black w-64 mb-2"></div>
          <div className="text-black">Signed</div>
        </div>

        {/* Company Name */}
        <div className="text-center mt-16" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt' }}>
          <div className="text-black font-bold">
            {companySettings?.companyName || 'Dewatering Construction Etc Limited.'}
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-8 text-xs text-gray-600" style={{ fontFamily: 'Arial, sans-serif' }}>
          <div>Waybill ID: {waybill.id}</div>
          {waybill.expectedReturnDate && (
            <div>Expected Return: {format(waybill.expectedReturnDate, 'dd MMMM yyyy')}</div>
          )}
        </div>
      </div>
    </div>
  );
}