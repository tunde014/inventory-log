import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Asset } from "@/types/asset";
import { useToast } from "@/hooks/use-toast";

interface AddAssetFormProps {
  onAddAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddAssetForm({ onAddAsset }: AddAssetFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    category: "",
    type: "",
    unitPrice: "",
    location: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.quantity || !formData.category || !formData.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const assetData = {
      name: formData.name,
      description: formData.description || undefined,
      quantity: parseInt(formData.quantity),
      category: formData.category as 'dewatering' | 'waterproofing',
      type: formData.type as 'consumable' | 'non-consumable' | 'tools' | 'equipment',
      unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : undefined,
      location: formData.location || undefined
    };

    onAddAsset(assetData);
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      quantity: "",
      category: "",
      type: "",
      unitPrice: "",
      location: ""
    });

    toast({
      title: "Success",
      description: "Asset added successfully"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Asset
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
              <Label htmlFor="unitPrice">Unit Price</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                placeholder="Enter unit price"
              />
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
          
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}