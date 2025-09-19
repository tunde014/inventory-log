import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Asset } from "@/types/asset";
import { useToast } from "@/hooks/use-toast";

export interface AddAssetFormProps {
  asset?: Asset;
  onSave?: (updatedAsset: Asset) => void;
  onAddAsset?: (assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function AddAssetForm({ asset, onSave, onAddAsset, onCancel }: AddAssetFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    unitOfMeasurement: "",
    category: "",
    type: "",
    location: ""
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        description: asset.description || "",
        quantity: asset.quantity.toString(),
        unitOfMeasurement: asset.unitOfMeasurement,
        category: asset.category,
        type: asset.type,
        location: asset.location || ""
      });
    }
  }, [asset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.quantity || !formData.unitOfMeasurement || !formData.category || !formData.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (asset && onSave) {
      // Editing existing asset
      const updatedAsset: Asset = {
        ...asset,
        name: formData.name,
        description: formData.description || undefined,
        quantity: parseInt(formData.quantity),
        unitOfMeasurement: formData.unitOfMeasurement,
        category: formData.category as 'dewatering' | 'waterproofing',
        type: formData.type as 'consumable' | 'non-consumable' | 'tools' | 'equipment',
        location: formData.location || undefined,
        updatedAt: new Date()
      };
      onSave(updatedAsset);
    } else if (onAddAsset) {
      // Adding new asset
      const assetData = {
        name: formData.name,
        description: formData.description || undefined,
        quantity: parseInt(formData.quantity),
        unitOfMeasurement: formData.unitOfMeasurement,
        category: formData.category as 'dewatering' | 'waterproofing',
        type: formData.type as 'consumable' | 'non-consumable' | 'tools' | 'equipment',
        location: formData.location || undefined
      };
      onAddAsset(assetData);
    }
    
    toast({
      title: "Success",
      description: "Asset saved successfully"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {asset ? "Edit Asset" : "Add New Asset"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter asset name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Enter quantity"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unitOfMeasurement">Unit of Measurement *</Label>
              <Select 
                value={formData.unitOfMeasurement} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, unitOfMeasurement: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">Pieces</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                  <SelectItem value="rolls">Rolls</SelectItem>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="sets">Sets</SelectItem>
                  <SelectItem value="packs">Packs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dewatering">Dewatering Materials</SelectItem>
                  <SelectItem value="waterproofing">Waterproofing Materials</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumable">Consumable</SelectItem>
                  <SelectItem value="non-consumable">Non-Consumable</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Storage location"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter asset description"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {asset ? "Save Changes" : "Add Asset"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}