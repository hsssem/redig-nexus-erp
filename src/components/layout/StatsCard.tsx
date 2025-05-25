
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAppSettings } from '@/contexts/AppSettingsContext';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  isMonetary?: boolean;
}

const StatsCard = ({ title, value, description, icon, className, isMonetary = false }: StatsCardProps) => {
  const { currencySymbol } = useAppSettings();
  
  const displayValue = isMonetary && typeof value === 'number' 
    ? `${currencySymbol}${value.toLocaleString()}` 
    : value;

  return (
    <Card className={cn(
      "backdrop-blur-sm transition-all duration-300 hover:shadow-lg border-t-4 border-t-darkblue-500", 
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-gradient-to-r from-darkblue-600 to-darkblue-400 bg-clip-text text-transparent">
          {displayValue}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
