import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Waybill, ReturnBill } from "@/types/asset";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ReturnFormProps {
  waybill: Waybill;
  onProcessReturn: (returnData: Omit<ReturnBill, 'id'>) => void;
  onCancel: () => void;
}

interface ReturnItemInput {
  assetId: string;
  assetName: string;
  issuedQuantity: number;
  returnedQuantity: number;
  returningQuantity: number;
  condition: 'good' | 'damaged' | 'missing';
}

export function ReturnForm({ waybill, onProcessReturn, onCancel }: ReturnFormProps) {
  const { toast } = useToast();
  const [receivedBy, setReceivedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ReturnItemInput[]>(
    waybill.items.map(item => ({
      assetId: item.assetId,
      assetName: item.assetName,
      issuedQuantity: item.quantity,
      returnedQuantity: item.returnedQuantity,
      returningQuantity: item.quantity - item.returnedQuantity,
      condition: 'good' as const
    }))
  );

  const updateItem = (index: number, field: keyof ReturnItemInput, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receivedBy.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter who received the items",
        variant: "destructive"
      });
      return;
    }

    // Validate return quantities
    for (const item of items) {
      const maxReturnable = item.issuedQuantity - item.returnedQuantity;
      if (item.returningQuantity > maxReturnable) {
        toast({
          title: "Invalid Return Quantity",
          description: `Cannot return more than ${maxReturnable} of ${item.assetName}`,
          variant: "destructive"
        });
        return;
      }
      if (item.returningQuantity < 0) {
        toast({
          title: "Invalid Return Quantity",
          description: `Return quantity cannot be negative for ${item.assetName}`,
          variant: "destructive"
        });
        return;
      }
    }

    const returnData: Omit<ReturnBill, 'id'> = {
      waybillId: waybill.id,
      items: items
        .filter(item => item.returningQuantity > 0)
        .map(item => ({
          assetId: item.assetId,
          assetName: item.assetName,
          quantity: item.returningQuantity,
          condition: item.condition
        })),
      returnDate: new Date(),
      receivedBy: receivedBy.trim(),
      condition: items.some(item => item.condition !== 'good') ? 'damaged' : 'good',
      notes: notes.trim() || undefined,
      status: 'completed'
    };

    if (returnData.items.length === 0) {
      toast({
        title: "No Items to Return",
        description: "Please specify quantities for items being returned",
        variant: "destructive"
      });
      return;
    }

    onProcessReturn(returnData);
  };

  const getTotalOutstanding = () => {
    return items.reduce((total, item) => total + (item.issuedQuantity - item.returnedQuantity), 0);
  };

  const getTotalReturning = () => {
    return items.reduce((total, item) => total + item.returningQuantity, 0);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Process Return - Waybill {waybill.id}</CardTitle>
        <div className="text-sm text-muted-foreground">
          <div>Employee: {waybill.employee} | Department: {waybill.department}</div>
          <div>Issue Date: {format(waybill.issueDate, 'dd MMM yyyy')}</div>
          {waybill.expectedReturnDate && (
            <div>Expected Return: {format(waybill.expectedReturnDate, 'dd MMM yyyy')}</div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="receivedBy">Received By *</Label>
              <Input
                id="receivedBy"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                placeholder="Enter name of receiver"
                required
              />
            </div>
            <div>
              <Label htmlFor="returnDate">Return Date</Label>
              <Input
                id="returnDate"
                type="date"
                value={format(new Date(), 'yyyy-MM-dd')}
                disabled
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes about the return"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Return Items</Label>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                <div>Total Items Outstanding: {getTotalOutstanding()}</div>
                <div>Total Items Returning: {getTotalReturning()}</div>
                <div>Remaining Outstanding: {getTotalOutstanding() - getTotalReturning()}</div>
              </div>
            </div>

            {items.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="font-medium">{item.assetName}</div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label>Issued Quantity</Label>
                    <Input value={item.issuedQuantity} disabled />
                  </div>
                  <div>
                    <Label>Previously Returned</Label>
                    <Input value={item.returnedQuantity} disabled />
                  </div>
                  <div>
                    <Label>Outstanding</Label>
                    <Input value={item.issuedQuantity - item.returnedQuantity} disabled />
                  </div>
                  <div>
                    <Label>Returning Now</Label>
                    <Input
                      type="number"
                      min="0"
                      max={item.issuedQuantity - item.returnedQuantity}
                      value={item.returningQuantity}
                      onChange={(e) => updateItem(index, 'returningQuantity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Condition</Label>
                  <Select
                    value={item.condition}
                    onValueChange={(value: 'good' | 'damaged' | 'missing') => updateItem(index, 'condition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good Condition</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                      <SelectItem value="missing">Missing/Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Process Return
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}