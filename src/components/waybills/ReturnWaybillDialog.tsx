import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ReturnWaybillDialog({ waybill, sites, open, onClose, onReturn }) {
  const [selectedItems, setSelectedItems] = useState(
    waybill.items.map(item => ({
      ...item,
      returnQuantity: item.quantity,
      selected: false,
    }))
  );
  const [destination, setDestination] = useState("store");
  const [selectedSite, setSelectedSite] = useState("");

  const handleItemChange = (idx, field, value) => {
    setSelectedItems(items =>
      items.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = () => {
    const itemsToReturn = selectedItems.filter(item => item.selected && item.returnQuantity > 0);
    if (itemsToReturn.length === 0) {
      alert("Select at least one item to return.");
      return;
    }
    if (destination === "site" && !selectedSite) {
      alert("Select a destination site.");
      return;
    }
    onReturn({
      items: itemsToReturn,
      destination,
      site: selectedSite,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Return Waybill Items</DialogHeader>
        <div>
          <label className="block font-medium mb-2">Destination</label>
          <select
            value={destination}
            onChange={e => setDestination(e.target.value)}
            className="border rounded px-2 py-1 mb-4 w-full"
          >
            <option value="store">Store</option>
            <option value="site">Another Site</option>
          </select>
          {destination === "site" && (
            <select
              value={selectedSite}
              onChange={e => setSelectedSite(e.target.value)}
              className="border rounded px-2 py-1 mb-4 w-full"
            >
              <option value="">Select Site</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          )}
        </div>
        <div>
          <table className="min-w-full border mb-4">
            <thead>
              <tr>
                <th></th>
                <th>Item</th>
                <th>Qty Issued</th>
                <th>Qty to Return</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, idx) => (
                <tr key={item.assetId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={e => handleItemChange(idx, "selected", e.target.checked)}
                    />
                  </td>
                  <td>{item.assetName}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={item.quantity}
                      value={item.returnQuantity}
                      onChange={e => handleItemChange(idx, "returnQuantity", Number(e.target.value))}
                      className="border px-1 w-16"
                      disabled={!item.selected}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Return Selected</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}