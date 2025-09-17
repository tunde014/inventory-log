import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  RotateCcw, 
  Plus,
  Activity
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Asset Inventory', icon: Package },
    { id: 'waybills', label: 'Waybills', icon: FileText },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'quick-checkout', label: 'Quick Checkout', icon: Activity },
    { id: 'add-asset', label: 'Add Asset', icon: Plus },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">AssetTracker</h1>
        <p className="text-sm text-muted-foreground">Asset Management System</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              activeTab === item.id && "bg-primary text-primary-foreground"
            )}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
}