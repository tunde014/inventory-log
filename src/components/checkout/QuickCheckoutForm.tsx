import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, Plus } from "lucide-react";
import { Asset, QuickCheckout } from "@/types/asset";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays } from "date-fns";

interface QuickCheckoutFormProps {
  assets: Asset[];
  quickCheckouts: QuickCheckout[];
  onQuickCheckout: (checkout: Omit<QuickCheckout, 'id'>) => void;
  onReturnItem: (checkoutId: string) => void;
}

export function QuickCheckoutForm({ 
  assets, 
  quickCheckouts, 
  onQuickCheckout, 
  onReturnItem 
}: QuickCheckoutFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    assetId: "",
    quantity: "",
    employee: "",
    expectedReturnDays: "7"
  });

  const availableAssets = assets.filter(asset => asset.quantity > 0);
  const pendingCheckouts = quickCheckouts.filter(checkout => checkout.status === 'outstanding');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.assetId || !formData.quantity || !formData.employee) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedAsset = assets.find(a => a.id === formData.assetId);
    if (!selectedAsset) {
      toast({
        title: "Error",
        description: "Selected asset not found",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseInt(formData.quantity);
    if (quantity > selectedAsset.quantity) {
      toast({
        title: "Error",
        description: "Insufficient quantity available",
        variant: "destructive"
      });
      return;
    }

    const checkoutData = {
      assetId: formData.assetId,
      assetName: selectedAsset.name,
      quantity,
      employee: formData.employee,
      checkoutDate: new Date(),
      expectedReturnDays: parseInt(formData.expectedReturnDays),
      status: 'outstanding' as const
    };

    onQuickCheckout(checkoutData);
    
    // Reset form
    setFormData({
      assetId: "",
      quantity: "",
      employee: "",
      expectedReturnDays: "7"
    });

    toast({
      title: "Success",
      description: "Item checked out successfully"
    });
  };

  const getDaysOut = (checkoutDate: Date) => {
    return differenceInDays(new Date(), checkoutDate);
  };

  const getStatusBadge = (checkout: QuickCheckout) => {
    const daysOut = getDaysOut(checkout.checkoutDate);
    
    if (daysOut > checkout.expectedReturnDays) {
      return <Badge className="bg-overdue text-overdue-foreground">Overdue ({daysOut} days)</Badge>;
    } else if (daysOut >= checkout.expectedReturnDays - 1) {
      return <Badge className="bg-warning text-warning-foreground">Due Soon ({daysOut} days)</Badge>;
    } else {
      return <Badge className="bg-pending text-pending-foreground">Outstanding ({daysOut} days)</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Checkout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asset">Asset *</Label>
                <Select 
                  value={formData.assetId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, assetId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAssets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name} (Available: {asset.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Enter quantity"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employee">Employee *</Label>
                <Input
                  id="employee"
                  value={formData.employee}
                  onChange={(e) => setFormData(prev => ({ ...prev, employee: e.target.value }))}
                  placeholder="Employee name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectedDays">Expected Return (Days)</Label>
                <Select 
                  value={formData.expectedReturnDays} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, expectedReturnDays: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">1 Week</SelectItem>
                    <SelectItem value="14">2 Weeks</SelectItem>
                    <SelectItem value="30">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              <Activity className="h-4 w-4 mr-2" />
              Checkout Item
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Pending Returns
            <Badge variant="outline" className="ml-auto">
              {pendingCheckouts.length} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Checkout Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingCheckouts.map((checkout) => (
                <TableRow key={checkout.id}>
                  <TableCell className="font-medium">{checkout.assetName}</TableCell>
                  <TableCell>{checkout.employee}</TableCell>
                  <TableCell>{checkout.quantity}</TableCell>
                  <TableCell>{format(checkout.checkoutDate, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{getStatusBadge(checkout)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReturnItem(checkout.id)}
                    >
                      Mark Returned
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}