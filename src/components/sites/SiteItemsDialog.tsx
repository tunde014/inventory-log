import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FileText, Package, RotateCcw } from 'lucide-react';
import { Waybill } from '@/types/asset';
import { Site } from './SitesPage';

interface SiteItemsDialogProps {
  site: Site;
  waybills: Waybill[];
  isOpen: boolean;
  onClose: () => void;
  onCreateReturnWaybill: (siteId: string, waybillItems: any[]) => void;
}

export function SiteItemsDialog({ 
  site, 
  waybills, 
  isOpen, 
  onClose, 
  onCreateReturnWaybill 
}: SiteItemsDialogProps) {
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({});

  // Get all items that have been taken to this site
  const siteWaybills = waybills.filter(wb => wb.site === site.name);
  const siteItems = siteWaybills.flatMap(wb => 
    wb.items.map(item => ({
      ...item,
      waybillId: wb.id,
      issueDate: wb.issueDate,
      status: item.status
    }))
  );

  const handleItemSelection = (itemKey: string, quantity: number) => {
    if (quantity === 0) {
      const { [itemKey]: removed, ...rest } = selectedItems;
      setSelectedItems(rest);
    } else {
      setSelectedItems(prev => ({ ...prev, [itemKey]: quantity }));
    }
  };

  const handleCreateReturnWaybill = () => {
    const returnItems = Object.entries(selectedItems).map(([key, quantity]) => {
      const [waybillId, assetId] = key.split('-');
      const originalItem = siteItems.find(item => 
        item.waybillId === waybillId && item.assetId === assetId
      );
      return {
        assetId,
        assetName: originalItem?.assetName || '',
        quantity,
        waybillId,
        availableQuantity: (originalItem?.quantity || 0) - (originalItem?.returnedQuantity || 0)
      };
    });

    onCreateReturnWaybill(site.id, returnItems);
    setSelectedItems({});
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'outstanding': return 'destructive';
      case 'return_initiated': return 'secondary';
      case 'return_completed': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Items at {site.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {siteItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No items have been taken to this site yet.
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {siteItems.map((item) => {
                  const itemKey = `${item.waybillId}-${item.assetId}`;
                  const availableQuantity = item.quantity - item.returnedQuantity;
                  const selectedQuantity = selectedItems[itemKey] || 0;

                  return (
                    <Card key={itemKey} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{item.assetName}</h4>
                              <Badge variant={getStatusColor(item.status)}>
                                {item.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                Waybill: {item.waybillId}
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                {new Date(item.issueDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                Available: {availableQuantity} / {item.quantity}
                              </div>
                            </div>
                          </div>

                          {availableQuantity > 0 && (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max={availableQuantity}
                                value={selectedQuantity}
                                onChange={(e) => handleItemSelection(itemKey, parseInt(e.target.value) || 0)}
                                className="w-20 px-2 py-1 border rounded text-center"
                                placeholder="Qty"
                              />
                              <span className="text-sm text-muted-foreground">
                                / {availableQuantity}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {Object.keys(selectedItems).length > 0 && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedItems({})}>
                    Clear Selection
                  </Button>
                  <Button onClick={handleCreateReturnWaybill}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Create Return Waybill
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}