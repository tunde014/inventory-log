import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Eye, RotateCcw } from "lucide-react";
import { Waybill } from "@/types/asset";
import { format } from "date-fns";

interface WaybillListProps {
  waybills: Waybill[];
  onViewWaybill: (waybill: Waybill) => void;
  onInitiateReturn: (waybill: Waybill) => void;
}

export function WaybillList({ waybills, onViewWaybill, onInitiateReturn }: WaybillListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'issued':
        return <Badge className="bg-pending text-pending-foreground">Issued</Badge>;
      case 'partially_returned':
        return <Badge className="bg-warning text-warning-foreground">Partially Returned</Badge>;
      case 'fully_returned':
        return <Badge className="bg-available text-available-foreground">Fully Returned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isOverdue = (expectedReturnDate?: Date) => {
    if (!expectedReturnDate) return false;
    return new Date() > expectedReturnDate;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Waybills
          <Badge variant="outline" className="ml-auto">
            {waybills.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waybill ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Expected Return</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {waybills.map((waybill) => (
              <TableRow key={waybill.id}>
                <TableCell className="font-mono">{waybill.id}</TableCell>
                <TableCell>{waybill.employee}</TableCell>
                <TableCell>{waybill.department}</TableCell>
                <TableCell>{format(waybill.issueDate, 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  {waybill.expectedReturnDate ? (
                    <div className={isOverdue(waybill.expectedReturnDate) ? 'text-overdue' : ''}>
                      {format(waybill.expectedReturnDate, 'MMM dd, yyyy')}
                      {isOverdue(waybill.expectedReturnDate) && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Overdue
                        </Badge>
                      )}
                    </div>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(waybill.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewWaybill(waybill)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {waybill.status !== 'fully_returned' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onInitiateReturn(waybill)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}