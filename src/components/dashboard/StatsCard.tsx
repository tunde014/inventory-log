import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default' 
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-l-4 border-l-success';
      case 'warning':
        return 'border-l-4 border-l-warning';
      case 'info':
        return 'border-l-4 border-l-info';
      default:
        return 'border-l-4 border-l-primary';
    }
  };

  return (
    <Card className={getVariantStyles()}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${
            trend.isPositive ? 'text-success' : 'text-destructive'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}