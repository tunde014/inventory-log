import { useState } from "react";
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
import { Asset, Waybill, QuickCheckout, ReturnBill } from "@/types/asset";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showWaybillDocument, setShowWaybillDocument] = useState<Waybill | null>(null);
  const [showReturnForm, setShowReturnForm] = useState<Waybill | null>(null);
  
  // Sample data - in a real app, this would come from a backend/database
  const [assets, setAssets] = useState<Asset[]>([
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
  ]);

  const [waybills, setWaybills] = useState<Waybill[]>([
    {
      id: "WB001",
      items: [
        { assetId: "1", assetName: "Industrial Water Pump", quantity: 1, returnedQuantity: 0, status: "outstanding" }
      ],
      employee: "John Smith",
      department: "Construction",
      purpose: "Site dewatering project",
      driverName: "Mike Driver",
      vehicle: "Toyota Hilux - ABC-123D",
      issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      expectedReturnDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: "outstanding",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [quickCheckouts, setQuickCheckouts] = useState<QuickCheckout[]>([
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
  ]);

  const handleAddAsset = (assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAsset: Asset = {
      ...assetData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setAssets(prev => [...prev, newAsset]);
  };

  const handleEditAsset = (asset: Asset) => {
    // In a real app, this would open an edit modal
    toast({
      title: "Edit Asset",
      description: `Editing ${asset.name} (Feature coming soon)`
    });
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

  const renderContent = () => {
    if (showWaybillDocument) {
      return <WaybillDocument waybill={showWaybillDocument} onClose={() => setShowWaybillDocument(null)} />;
    }
    
    if (showReturnForm) {
      return <ReturnForm 
        waybill={showReturnForm} 
        onProcessReturn={handleProcessReturn}
        onCancel={() => setShowReturnForm(null)}
      />;
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard assets={assets} waybills={waybills} quickCheckouts={quickCheckouts} />;
      case "assets":
        return <AssetList assets={assets} onEditAsset={handleEditAsset} />;
      case "add-asset":
        return <AddAssetForm onAddAsset={handleAddAsset} />;
      case "create-waybill":
        return <WaybillForm 
          assets={assets}
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
      case "settings":
        return <CompanySettings />;
      default:
        return <Dashboard assets={assets} waybills={waybills} quickCheckouts={quickCheckouts} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
