
import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Scatter, ScatterChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, ZAxis, ComposedChart, Area
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { invoices, projects, tasks, meetings } from '@/services/mockData';
import { format } from 'date-fns';

interface DataPoint {
  name: string;
  value: number;
}

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('year');
  const { currencySymbol } = useAppSettings();
  const form = useForm();

  // Prepare data for the charts
  const projectsByStatus = useMemo(() => {
    const statusCount: Record<string, number> = {};
    projects.forEach(project => {
      statusCount[project.status] = (statusCount[project.status] || 0) + 1;
    });
    
    return Object.entries(statusCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
      value
    }));
  }, []);

  const taskCompletion = useMemo(() => {
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const notStarted = tasks.filter(task => task.status === 'not-started').length;
    
    return [
      { name: 'Completed', value: completed },
      { name: 'In Progress', value: inProgress },
      { name: 'Not Started', value: notStarted }
    ];
  }, []);

  const projectEfficiency = useMemo(() => {
    return projects.map(project => {
      const projectTasks = tasks.filter(task => task.project === project.id);
      const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
      const efficiency = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
      
      return {
        name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
        efficiency: Math.round(efficiency),
        budget: project.budget || 0,
        progress: project.progress
      };
    });
  }, []);

  const monthlyRevenue = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    const monthlyData = Array(12).fill(0).map((_, i) => ({ 
      month: months[i],
      revenue: 0,
      expenses: Math.round(Math.random() * 5000 + 3000) // Fake expenses data
    }));

    // Calculate revenue from invoices with status "paid"
    invoices
      .filter(invoice => invoice.status === 'paid' && new Date(invoice.date).getFullYear() === currentYear)
      .forEach(invoice => {
        const month = new Date(invoice.date).getMonth();
        monthlyData[month].revenue += invoice.total;
      });
    
    return monthlyData;
  }, []);

  const totalRevenueByClient = useMemo(() => {
    const revenueByClient: Record<string, number> = {};
    
    invoices
      .filter(invoice => invoice.status === 'paid')
      .forEach(invoice => {
        revenueByClient[invoice.customer] = (revenueByClient[invoice.customer] || 0) + invoice.total;
      });
    
    return Object.entries(revenueByClient).map(([name, value]) => ({ name, value }));
  }, []);

  const projectCompletionData = useMemo(() => {
    return projects.map(project => ({
      name: project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name,
      startDate: new Date(project.startDate).getTime(),
      progress: project.progress,
      budget: project.budget || 0
    }));
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <PageContainer className="flex-1">
        <PageHeader
          title="Analytics"
          description="Business performance insights and metrics"
        />

        <div className="mb-6 flex items-center justify-between">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="ml-auto">
            Last updated: {format(new Date(), 'MMM dd, yyyy')}
          </Badge>
        </div>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-md backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Monthly Revenue vs Expenses</CardTitle>
              <CardDescription>Financial performance over the year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${currencySymbol}${value}`} />
                    <Tooltip formatter={(value) => [`${currencySymbol}${value.toLocaleString()}`, '']} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#8884d8" />
                    <Line yAxisId="left" type="monotone" dataKey="expenses" name="Expenses" stroke="#ff7300" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Projects by Status</CardTitle>
              <CardDescription>Current project status distribution</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[300px] w-full max-w-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {projectsByStatus.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} projects`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Project Efficiency</CardTitle>
              <CardDescription>Progress vs Budget allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid opacity={0.3} />
                    <XAxis type="number" dataKey="budget" name="Budget" tickFormatter={(value) => `${currencySymbol}${value}`} />
                    <YAxis dataKey="progress" name="Progress" unit="%" />
                    <ZAxis dataKey="efficiency" range={[50, 400]} name="Efficiency" unit="%" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'Budget') return [`${currencySymbol}${value}`, name];
                        return [`${value}%`, name];
                      }}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Legend />
                    <Scatter name="Projects" data={projectEfficiency} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Revenue by Client</CardTitle>
              <CardDescription>Top clients by revenue generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={totalRevenueByClient.sort((a, b) => b.value - a.value).slice(0, 5)}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} />
                    <XAxis type="number" tickFormatter={(value) => `${currencySymbol}${value}`} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${currencySymbol}${value.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="value" name="Revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Task Completion</CardTitle>
              <CardDescription>Status of all tasks in the system</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[300px] w-full max-w-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskCompletion}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {taskCompletion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                          entry.name === 'Completed' ? '#4ade80' : 
                          entry.name === 'In Progress' ? '#fb923c' :
                          '#ef4444'
                        } />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tasks`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Project progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid opacity={0.3} />
                    <XAxis 
                      type="number" 
                      dataKey="startDate" 
                      domain={['auto', 'auto']}
                      name="Start Date"
                      tickFormatter={(unixTime) => format(new Date(unixTime), 'MMM dd')}
                    />
                    <YAxis type="number" dataKey="progress" name="Progress" unit="%" />
                    <ZAxis dataKey="budget" range={[50, 400]} name="Budget" />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'Start Date') {
                          // Check if value is a number and convert only if it is
                          return [typeof value === 'number' ? format(new Date(value), 'MMM dd, yyyy') : String(value), name];
                        }
                        if (name === 'Progress') return [`${value}%`, name];
                        return [`${currencySymbol}${value}`, 'Budget'];
                      }}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Legend />
                    <Scatter name="Projects" data={projectCompletionData} fill="#8884d8">
                      {projectCompletionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.progress < 50 ? '#ef4444' : entry.progress < 80 ? '#fb923c' : '#4ade80'}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
};

export default Analytics;
