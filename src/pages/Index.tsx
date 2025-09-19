import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { AssetList } from "@/components/assets/AssetList";
import { AddAssetForm } from "@/components/assets/AddAssetForm";
import { WaybillList } from "@/components/waybills/WaybillList";
import { WaybillForm } from "@/components/waybills/WaybillForm";
import { WaybillDocument } from "@/components/waybills/WaybillDocument";
import { ReturnForm } from "@/components/waybills/ReturnForm";
import { QuickCheckoutForm } from "@/components/checkout/QuickCheckoutForm";
import { CompanySettings } from "@/components/settings/CompanySettings";
import { EmployeeVehicleSettings } from "@/components/settings/EmployeeVehicleSettings";
import { Asset, Waybill, QuickCheckout, ReturnBill } from "@/types/asset";
import { useToast } from "@/hooks/use-toast";
import { BulkImportAssets } from "@/components/assets/BulkImportAssets";
import { InventoryReport } from "@/components/assets/InventoryReport";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { SitesPage, Site } from "@/components/sites/SitesPage";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showWaybillDocument, setShowWaybillDocument] = useState<Waybill | null>(null);
  const [showReturnForm, setShowReturnForm] = useState<Waybill | null>(null);
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem("assets");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "1",
        name: "Industrial Water Pump",
        description: "High-capacity centrifugal pump for dewatering operations",
        quantity: 3,
        unitOfMeasurement: "pcs",
        category: "dewatering",
        type: "equipment",
        location: "Warehouse A",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2", 
        name: "Waterproof Membrane",
        description: "Heavy-duty waterproofing membrane sheets",
        quantity: 150,
        unitOfMeasurement: "rolls",
        category: "waterproofing",
        type: "consumable",
        location: "Storage Room B",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "3",
        name: "Submersible Pump",
        description: "Compact submersible pump for small scale dewatering",
        quantity: 0,
        unitOfMeasurement: "pcs",
        category: "dewatering", 
        type: "equipment",
        location: "Warehouse A",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "4",
        name: "Sealant Tubes",
        description: "Professional grade waterproof sealant",
        quantity: 25,
        unitOfMeasurement: "pcs",
        category: "waterproofing",
        type: "consumable", 
        location: "Storage Room B",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  });

  const [waybills, setWaybills] = useState<Waybill[]>(
    [
      {
        id: "WB001",
        items: [
          { assetId: "1", assetName: "Industrial Water Pump", quantity: 1, returnedQuantity: 0, status: "outstanding" }
        ],
        purpose: "Site dewatering project",
        driverName: "Mike Driver",
        vehicle: "Toyota Hilux - ABC-123D",
        issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expectedReturnDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: "outstanding",
        service: "Dewatering",
        site: "Main Construction Site",
        client: "ABC Construction",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  );

  const [quickCheckouts, setQuickCheckouts] = useState<QuickCheckout[]>(
    [
      {
        id: "QC001",
        assetId: "4",
        assetName: "Sealant Tubes",
        quantity: 2,
        employee: "Mike Johnson",
        checkoutDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expectedReturnDays: 7,
        status: "outstanding"
      }
    ]
  );

  const [showClearDialog, setShowClearDialog] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);
  const [sites, setSites] = useState<Site[]>([]);

  // Save assets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("assets", JSON.stringify(assets));
  }, [assets]);

  const handleAddAsset = (assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAsset: Asset = {
      ...assetData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setAssets(prev => [...prev, newAsset]);
  };

  const handleEditAsset = (asset: Asset) => setEditingAsset(asset);

  const handleDeleteAsset = (asset: Asset) => setDeletingAsset(asset);

  const handleSaveAsset = (updatedAsset: Asset) => {
    setAssets(prev =>
      prev.map(asset => (asset.id === updatedAsset.id ? updatedAsset : asset))
    );
    setEditingAsset(null);
  };

  const confirmDeleteAsset = () => {
    if (deletingAsset) {
      setAssets(prev => prev.filter(asset => asset.id !== deletingAsset.id));
      setDeletingAsset(null);
    }
  };

  const handleCreateWaybill = (waybillData: Omit<Waybill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWaybill: Waybill = {
      ...waybillData,
      id: `WB${Date.now().toString().slice(-6)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Update asset quantities
    waybillData.items.forEach(item => {
      setAssets(prev => prev.map(asset => 
        asset.id === item.assetId 
          ? { ...asset, quantity: asset.quantity - item.quantity, updatedAt: new Date() }
          : asset
      ));
    });
    
    setWaybills(prev => [...prev, newWaybill]);
    setShowWaybillDocument(newWaybill);
    setActiveTab("waybills");
    
    toast({
      title: "Waybill Created",
      description: `Waybill ${newWaybill.id} created successfully`
    });
  };

  const handleViewWaybill = (waybill: Waybill) => {
    setShowWaybillDocument(waybill);
  };

  const handleInitiateReturn = (waybill: Waybill) => {
    setShowReturnForm(waybill);
  };

  const handleProcessReturn = (returnData: Omit<ReturnBill, 'id'>) => {
    // Update waybill items with returned quantities
    setWaybills(prev => prev.map(waybill => {
      if (waybill.id === returnData.waybillId) {
        const updatedItems = waybill.items.map(item => {
          const returnItem = returnData.items.find(ri => ri.assetId === item.assetId);
          if (returnItem) {
            return {
              ...item,
              returnedQuantity: item.returnedQuantity + returnItem.quantity,
              status: (item.returnedQuantity + returnItem.quantity >= item.quantity) 
                ? 'return_completed' as const
                : 'return_initiated' as const
            };
          }
          return item;
        });
        
        const allItemsReturned = updatedItems.every(item => item.returnedQuantity >= item.quantity);
        
        return {
          ...waybill,
          items: updatedItems,
          status: allItemsReturned ? 'return_completed' as const : 'return_initiated' as const,
          updatedAt: new Date()
        };
      }
      return waybill;
    }));

    // Update asset quantities for items in good condition
    returnData.items.forEach(returnItem => {
      if (returnItem.condition === 'good') {
        setAssets(prev => prev.map(asset => 
          asset.id === returnItem.assetId 
            ? { ...asset, quantity: asset.quantity + returnItem.quantity, updatedAt: new Date() }
            : asset
        ));
      }
    });

    setShowReturnForm(null);
    
    toast({
      title: "Return Processed",
      description: `Return processed successfully for waybill ${returnData.waybillId}`
    });
  };

  const handleQuickCheckout = (checkoutData: Omit<QuickCheckout, 'id'>) => {
    const newCheckout: QuickCheckout = {
      ...checkoutData,
      id: Date.now().toString()
    };
    
    // Update asset quantity
    setAssets(prev => prev.map(asset => 
      asset.id === checkoutData.assetId 
        ? { ...asset, quantity: asset.quantity - checkoutData.quantity, updatedAt: new Date() }
        : asset
    ));
    
    setQuickCheckouts(prev => [...prev, newCheckout]);
  };

  const handleReturnItem = (checkoutId: string) => {
    const checkout = quickCheckouts.find(c => c.id === checkoutId);
    if (!checkout) return;

    // Update checkout status
    setQuickCheckouts(prev => prev.map(c => 
      c.id === checkoutId ? { ...c, status: 'return_completed' } : c
    ));

    // Return quantity to asset
    setAssets(prev => prev.map(asset => 
      asset.id === checkout.assetId 
        ? { ...asset, quantity: asset.quantity + checkout.quantity, updatedAt: new Date() }
        : asset
    ));

    toast({
      title: "Item Returned",
      description: `${checkout.assetName} returned by ${checkout.employee}`
    });
  };

  function renderContent() {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard assets={assets} waybills={waybills} quickCheckouts={quickCheckouts} />;
      case "assets":
        return <AssetList 
          assets={assets} 
          onEdit={handleEditAsset}
          onDelete={handleDeleteAsset}
        />;
      case "add-asset":
        return <AddAssetForm onAddAsset={handleAddAsset} onCancel={() => setActiveTab("dashboard")} />;
      case "create-waybill":
        return <WaybillForm 
          assets={assets}
          sites={sites}
          onCreateWaybill={handleCreateWaybill}
          onCancel={() => setActiveTab("dashboard")}
        />;
      case "waybills":
        return <WaybillList 
          waybills={waybills} 
          onViewWaybill={handleViewWaybill}
          onInitiateReturn={handleInitiateReturn}
        />;
      case "quick-checkout":
        return <QuickCheckoutForm 
          assets={assets}
          quickCheckouts={quickCheckouts}
          onQuickCheckout={handleQuickCheckout}
          onReturnItem={handleReturnItem}
        />;
      case "employee-vehicle-settings":
        return <EmployeeVehicleSettings />;
      case "settings":
        return <CompanySettings />;
      case "sites":
        return (
          <SitesPage
            sites={sites}
            waybills={waybills}
            onAddSite={site => setSites(prev => [...prev, site])}
            onUpdateSite={updatedSite =>
              setSites(prev =>
                prev.map(site => (site.id === updatedSite.id ? updatedSite : site))
              )
            }
            onDeleteSite={siteId => setSites(prev => prev.filter(site => site.id !== siteId))}
            onCreateReturnWaybill={(siteId, items) => {
              // This will be handled by the return waybill form
              console.log('Creating return waybill for site:', siteId, 'with items:', items);
            }}
          />
        );
      default:
        return <Dashboard assets={assets} waybills={waybills} quickCheckouts={quickCheckouts} />;
    }
  }

  // Update handleImport to map imported data to Asset type
  const handleImport = (importedAssets: any[]) => {
    const mapped = importedAssets.map((item, idx) => ({
      id: Date.now().toString() + idx,
      name: item.name || item.Name || "",
      description: item.description || item.Description || "",
      quantity: Number(item.quantity || item.Quantity || 0),
      unitOfMeasurement: item.unitOfMeasurement || item.UnitOfMeasurement || "",
      category: item.category || item.Category || "",
      type: item.type || item.Type || "",
      location: item.location || item.Location || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    setAssets(prev => [...prev, ...mapped]);
  };

  const isAssetInventoryTab = activeTab === "assets";

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-6">
        {isAssetInventoryTab && (
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex gap-4 w-full md:w-auto">
              <BulkImportAssets onImport={handleImport} />
              <InventoryReport assets={assets} />
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowClearDialog(true)}
              className="w-full md:w-auto"
            >
              Clear All Assets
            </Button>
          </div>
        )}

        {renderContent()}

        {/* Edit Dialog */}
        <Dialog open={!!editingAsset} onOpenChange={open => !open && setEditingAsset(null)}>
          <DialogContent>
            <DialogHeader>Edit Asset</DialogHeader>
            {editingAsset && (
              <AddAssetForm
                asset={editingAsset}
                onSave={handleSaveAsset}
                onCancel={() => setEditingAsset(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingAsset} onOpenChange={open => !open && setDeletingAsset(null)}>
          <DialogContent>
            <DialogHeader>
              Are you sure you want to delete this asset?
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingAsset(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteAsset}
              >
                Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Clear All Assets Dialog */}
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogContent>
            <DialogHeader>
              Are you sure you want to clear all assets? This action cannot be undone.
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowClearDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setAssets([]);
                  localStorage.removeItem("assets");
                  setShowClearDialog(false);
                }}
              >
                Yes, Clear All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Index;
