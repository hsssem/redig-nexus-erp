
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueChartProps {
  data: {
    month: string;
    revenue: number;
  }[];
  showAnalysis?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, showAnalysis = false }) => {
  const currentMonth = new Date().getMonth();
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const maxRevenueMonth = data.reduce((max, item) => 
    (item.revenue > max.revenue) ? item : max, data[0]);
  
  const getRevenueGrowth = () => {
    if (currentMonth <= 0) return 0;
    const lastMonth = data[currentMonth - 1].revenue;
    const thisMonth = data[currentMonth].revenue;
    if (lastMonth === 0) return 100;
    return ((thisMonth - lastMonth) / lastMonth * 100).toFixed(1);
  };

  return (
    <Card className="shadow-md backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Revenue Overview</CardTitle>
        <CardDescription>
          {showAnalysis ? (
            <span className="text-muted-foreground">
              Total revenue: ${totalRevenue.toLocaleString()}, with {maxRevenueMonth.month} being the best month at ${maxRevenueMonth.revenue.toLocaleString()}
            </span>
          ) : (
            <span className="text-muted-foreground">
              Monthly revenue for {new Date().getFullYear()}
              {currentMonth > 0 && ` (${getRevenueGrowth()}% from last month)`}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#colorGradient)" 
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9b87f5" stopOpacity={1} />
                  <stop offset="100%" stopColor="#33C3F0" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
