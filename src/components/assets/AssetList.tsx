import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Package, Filter } from "lucide-react";
import { Asset } from "@/types/asset";

interface AssetListProps {
  assets: Asset[];
  onEditAsset: (asset: Asset) => void;
}

export function AssetList({ assets, onEditAsset }: AssetListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || asset.category === categoryFilter;
    const matchesType = typeFilter === "all" || asset.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getStatusBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity <= 5) {
      return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
    } else {
      return <Badge className="bg-available text-available-foreground">Available</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    return (
      <Badge variant={category === 'dewatering' ? 'default' : 'secondary'}>
        {category === 'dewatering' ? 'Dewatering' : 'Waterproofing'}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "outline" | "secondary" | "default"> = {
      consumable: 'outline',
      'non-consumable': 'secondary',
      tools: 'default',
      equipment: 'default'
    };
    
    return (
      <Badge variant={variants[type] || 'outline'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Asset Inventory
          <Badge variant="outline" className="ml-auto">
            {filteredAssets.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="dewatering">Dewatering</SelectItem>
              <SelectItem value="waterproofing">Waterproofing</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="consumable">Consumable</SelectItem>
              <SelectItem value="non-consumable">Non-Consumable</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{asset.name}</div>
                    {asset.description && (
                      <div className="text-sm text-muted-foreground">
                        {asset.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getCategoryBadge(asset.category)}</TableCell>
                <TableCell>{getTypeBadge(asset.type)}</TableCell>
                <TableCell className="font-mono">{asset.quantity}</TableCell>
                <TableCell className="text-muted-foreground">{asset.unitOfMeasurement}</TableCell>
                <TableCell>{getStatusBadge(asset.quantity)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditAsset(asset)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}