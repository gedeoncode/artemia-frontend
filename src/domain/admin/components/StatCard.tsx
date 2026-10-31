// Stat Card Component (Enterprise version)
import { Icons } from "@/components/Icons";
import { 
  Badge,
  Card, 
  CardContent,  
  CardHeader, 
  CardTitle 
} from "@/components/ui/";
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  warning?: boolean;
  warningLabel?: string;
  isCurrency?: boolean;
  color?: "blue" | "green" | "amber" | "purple" | "red" | "indigo" | "emerald";
  onClick?: () => void;
}

export const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendLabel, 
  warning, 
  warningLabel, 
  isCurrency = false, 
  color = "blue",
  onClick 
}: StatCardProps) => {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-100 dark:border-blue-900/30",
    indigo: "from-indigo-500/10 to-indigo-600/5 border-indigo-100 dark:border-indigo-900/30",
    emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-100 dark:border-emerald-900/30",
    green: "from-green-500/10 to-green-600/5 border-green-100 dark:border-green-900/30",
    amber: "from-amber-500/10 to-amber-600/5 border-amber-100 dark:border-amber-900/30",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-100 dark:border-purple-900/30",
    red: "from-red-500/10 to-red-600/5 border-red-100 dark:border-red-900/30",
  };

  const formatValue = (val: number) => {
    if (isCurrency) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(val);
    }
    return val.toLocaleString();
  };

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer border bg-gradient-to-br ${colorClasses[color]}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {(trend !== undefined || warning) && (
          <div className="flex items-center gap-2 mt-2 text-xs">
            {trend !== undefined && trendLabel && (
              <div className={`flex items-center gap-1 ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {trend >= 0 ? (
                  <Icons.arrowTrendingUp className="w-3 h-3" />
                ) : (
                  <Icons.arrowTrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(trend)}%</span>
                <span className="text-muted-foreground">{trendLabel}</span>
              </div>
            )}
            {warning && warningLabel && (
              <Badge variant="danger" className="text-xs">
                {warningLabel}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};