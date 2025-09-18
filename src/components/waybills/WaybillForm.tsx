import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { Asset, Waybill } from "@/types/asset";
import { useToast } from "@/hooks/use-toast";

interface WaybillFormProps {
  assets: Asset[];
  onCreateWaybill: (waybillData: Omit<Waybill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

interface WaybillItemInput {
  assetId: string;
  assetName: string;
  quantity: number;
  availableQuantity: number;
}

export function WaybillForm({ assets, onCreateWaybill, onCancel }: WaybillFormProps) {
  const { toast } = useToast();
  const [purpose, setPurpose] = useState("");
  const [driverName, setDriverName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [items, setItems] = useState<WaybillItemInput[]>([
    { assetId: "", assetName: "", quantity: 1, availableQuantity: 0 }
  ]);
  const [service, setService] = useState("");
  const [site, setSite] = useState("");
  const [client, setClient] = useState("");

  const availableAssets = assets.filter(asset => asset.quantity > 0);

  const addItem = () => {
    setItems([...items, { assetId: "", assetName: "", quantity: 1, availableQuantity: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof WaybillItemInput, value: string | number) => {
    const newItems = [...items];
    if (field === 'assetId') {
      const selectedAsset = availableAssets.find(asset => asset.id === value);
      if (selectedAsset) {
        newItems[index] = {
          ...newItems[index],
          assetId: selectedAsset.id,
          assetName: selectedAsset.name,
          availableQuantity: selectedAsset.quantity,
          quantity: Math.min(newItems[index].quantity, selectedAsset.quantity)
        };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!driverName || !vehicle || !service || !site || !client) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const validItems = items.filter(item => item.assetId && item.quantity > 0);
    if (validItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item for the waybill",
        variant: "destructive"
      });
      return;
    }

    // Check if quantities are valid
    for (const item of validItems) {
      if (item.quantity > item.availableQuantity) {
        toast({
          title: "Insufficient Stock",
          description: `Not enough ${item.assetName} in stock (Available: ${item.availableQuantity})`,
          variant: "destructive"
        });
        return;
      }
    }

    const waybillData: Omit<Waybill, 'id' | 'createdAt' | 'updatedAt'> = {
      items: validItems.map(item => ({
        assetId: item.assetId,
        assetName: item.assetName,
        quantity: item.quantity,
        returnedQuantity: 0,
        status: 'outstanding'
      })),
      purpose,
      driverName,
      vehicle,
      issueDate: new Date(),
      expectedReturnDate: expectedReturnDate ? new Date(expectedReturnDate) : undefined,
      status: 'outstanding',
      service,
      site,
      client
    };

    onCreateWaybill(waybillData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Waybill</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="driverName">Driver's Name *</Label>
              <Input
                id="driverName"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Enter driver's name"
                required
              />
            </div>
            <div>
              <Label htmlFor="vehicle">Vehicle (Type & Reg No.) *</Label>
              <Input
                id="vehicle"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                placeholder="e.g., Toyota Hilux - ABC-123D"
                required
              />
            </div>
            <div>
              <Label htmlFor="expectedReturnDate">Expected Return Date</Label>
              <Input
                id="expectedReturnDate"
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="service">Service *</Label>
              <select
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="border rounded px-2 py-1 w-full mb-4"
                required
              >
                <option value="">Select a service</option>
                <option value="Dewatering">Dewatering</option>
                <option value="Waterproofing">Waterproofing</option>
                <option value="Tiling">Tiling</option>
                <option value="Repair and Maintenance">Repair and Maintenance</option>
              </select>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <Label htmlFor="site">Site *</Label>
              <Input
                id="site"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                placeholder="Enter site location"
                required
              />
            </div>
            <div>
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Enter client's name"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Items</Label>
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-end p-4 border rounded-lg">
                <div className="flex-1">
                  <Label>Asset</Label>
                  <Select
                    value={item.assetId}
                    onValueChange={(value) => updateItem(index, 'assetId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAssets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.name} (Available: {asset.quantity} {asset.unitOfMeasurement})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    max={item.availableQuantity}
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    placeholder="Qty"
                  />
                </div>
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
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Create Waybill
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