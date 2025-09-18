import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  FileText, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  Users
} from "lucide-react";
import { Asset, Waybill, QuickCheckout } from "@/types/asset";
import { format } from "date-fns";

interface DashboardProps {
  assets: Asset[];
  waybills: Waybill[];
  quickCheckouts: QuickCheckout[];
}

export function Dashboard({ assets, waybills, quickCheckouts }: DashboardProps) {
  const totalAssets = assets.length;
  const totalItems = assets.reduce((sum, asset) => sum + asset.quantity, 0);
  const lowStockItems = assets.filter(asset => asset.quantity <= 5 && asset.quantity > 0).length;
  const outOfStockItems = assets.filter(asset => asset.quantity === 0).length;
  const activeWaybills = waybills.filter(w => w.status !== 'return_completed').length;
  const pendingQuickCheckouts = quickCheckouts.filter(q => q.status === 'outstanding').length;

  const overdueReturns = waybills.filter(waybill => 
    waybill.expectedReturnDate && 
    new Date() > waybill.expectedReturnDate && 
    waybill.status !== 'return_completed'
  );

  const recentActivity = [
    ...waybills.slice(-5).map(w => ({
      type: 'waybill',
      description: `Waybill ${w.id} for ${w.purpose}`,
      date: w.issueDate,
      status: w.status
    })),
    ...quickCheckouts.slice(-3).map(q => ({
      type: 'checkout',
      description: `${q.assetName} checked out by ${q.employee}`,
      date: q.checkoutDate,
      status: q.status
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Assets"
          value={totalAssets}
          icon={Package}
          variant="default"
        />
        <StatsCard
          title="Total Items"
          value={totalItems.toLocaleString()}
          icon={TrendingUp}
          variant="success"
        />
        <StatsCard
          title="Active Waybills"
          value={activeWaybills}
          icon={FileText}
          variant="info"
        />
        <StatsCard
          title="Pending Returns"
          value={pendingQuickCheckouts}
          icon={Clock}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outOfStockItems > 0 && (
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span className="text-sm font-medium">Out of Stock</span>
                  </div>
                  <Badge variant="destructive">{outOfStockItems} items</Badge>
                </div>
              )}
              {lowStockItems > 0 && (
                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-sm font-medium">Low Stock</span>
                  </div>
                  <Badge className="bg-warning text-warning-foreground">{lowStockItems} items</Badge>
                </div>
              )}
              {overdueReturns.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-overdue/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-overdue rounded-full"></div>
                    <span className="text-sm font-medium">Overdue Returns</span>
                  </div>
                  <Badge className="bg-overdue text-overdue-foreground">{overdueReturns.length} waybills</Badge>
                </div>
              )}
              {outOfStockItems === 0 && lowStockItems === 0 && overdueReturns.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No inventory alerts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'waybill' ? 'bg-primary' : 'bg-info'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(activity.date, 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}