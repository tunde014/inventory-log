import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Site } from '@/components/sites/SitesPage';
import { useEmployeeVehicleSettings } from '@/hooks/useEmployeeVehicleSettings';

interface SiteReturnWaybillFormProps {
  sites: Site[];
  selectedItems: any[];
  onCreateReturnWaybill: (returnData: any) => void;
  onCancel: () => void;
}

export function SiteReturnWaybillForm({ 
  sites, 
  selectedItems, 
  onCreateReturnWaybill, 
  onCancel 
}: SiteReturnWaybillFormProps) {
  const { toast } = useToast();
  const { employees, vehicles } = useEmployeeVehicleSettings();
  
  const [driverName, setDriverName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [returnToSite, setReturnToSite] = useState('');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState(selectedItems.map(item => ({
    ...item,
    returnQuantity: item.quantity,
    condition: 'good' as 'good' | 'damaged' | 'missing'
  })));

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const addItem = () => {
    setItems([...items, {
      assetId: '',
      assetName: '',
      quantity: 1,
      returnQuantity: 1,
      condition: 'good' as const,
      availableQuantity: 0
    }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!driverName || !vehicle) {
      toast({
        title: "Missing Information",
        description: "Please fill in driver and vehicle information",
        variant: "destructive"
      });
      return;
    }

    const validItems = items.filter(item => item.returnQuantity > 0);
    if (validItems.length === 0) {
      toast({
        title: "No Items",
        description: "Please select at least one item to return",
        variant: "destructive"
      });
      return;
    }

    const returnWaybillData = {
      id: `RWB${Date.now().toString().slice(-6)}`,
      type: 'return',
      driverName,
      vehicle,
      returnDate: new Date(returnDate),
      returnToSite: returnToSite || null, // null means returning to main inventory
      items: validItems.map(item => ({
        assetId: item.assetId,
        assetName: item.assetName,
        quantity: item.returnQuantity,
        condition: item.condition,
        originalWaybillId: item.waybillId
      })),
      status: 'pending_processing',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onCreateReturnWaybill(returnWaybillData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Create Return Waybill
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="driverName">Driver's Name *</Label>
              <Select value={driverName} onValueChange={setDriverName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name} {employee.position && `(${employee.position})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vehicle">Vehicle *</Label>
              <Select value={vehicle} onValueChange={setVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={`${v.type} - ${v.registrationNumber}`}>
                      {v.type} - {v.registrationNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="returnDate">Return Date *</Label>
              <Input
                id="returnDate"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="returnToSite">Return To</Label>
              <Select value={returnToSite} onValueChange={setReturnToSite}>
                <SelectTrigger>
                  <SelectValue placeholder="Main Inventory (default)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Main Inventory</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.name}>
                      {site.name} - {site.client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Return Items</Label>
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                <div className="md:col-span-2">
                  <Label>Asset Name</Label>
                  <div className="text-sm font-medium">{item.assetName}</div>
                  <div className="text-xs text-muted-foreground">
                    Available: {item.availableQuantity || item.quantity}
                  </div>
                </div>

                <div>
                  <Label>Return Quantity</Label>
                  <Input
                    type="number"
                    min="0"
                    max={item.availableQuantity || item.quantity}
                    value={item.returnQuantity}
                    onChange={(e) => updateItem(index, 'returnQuantity', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label>Condition</Label>
                  <Select 
                    value={item.condition} 
                    onValueChange={(value) => updateItem(index, 'condition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                      <SelectItem value="missing">Missing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Create Return Waybill
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