
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import StatsCard from '@/components/layout/StatsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import StatusDonutChart from '@/components/dashboard/StatusDonutChart';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import TranslatedText from '@/components/language/TranslatedText';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 
  'August', 'September', 'October', 'November', 'December'
];

const Dashboard = () => {
  const { user } = useAuth();
  const { currencySymbol, loading: settingsLoading } = useAppSettings();
  const { stats, loading: statsLoading } = useDashboardStats();
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Get user display name from Supabase user object
  const getUserDisplayName = () => {
    if (!user) return 'User';
    const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    return displayName.split(' ')[0]; // Get first name
  };

  const handleMonthChange = (monthIndex: string) => {
    setSelectedMonth(parseInt(monthIndex));
  };

  if (settingsLoading || statsLoading) {
    return (
      <PageContainer>
        <PageHeader 
          title="Loading..." 
          description="Loading your dashboard"
        />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader 
        title={`Welcome back, ${getUserDisplayName()}`} 
        description="Here's an overview of your business performance"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Period:</span>
          <Select 
            value={selectedMonth.toString()} 
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          description={`${stats.activeCustomers} active customers`}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        />
        <StatsCard
          title={`Revenue (${MONTHS[selectedMonth]})`}
          value={stats.monthlyRevenue}
          description={`${stats.thisMonthProjects} projects this month`}
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
          isMonetary={true}
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          description={`${stats.completedProjects} completed projects`}
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        />
        <StatsCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          description="Tasks across all projects"
          className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
        />
      </div>
      
      {/* Project Payment Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <StatsCard
          title="Projects Paid"
          value={stats.paidProjects}
          description={`${stats.paidInvoices} invoices have been paid`}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
        />
        <StatsCard
          title="Projects Unpaid"
          value={stats.unpaidProjects}
          description="Projects awaiting payment"
          className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
        />
      </div>
      
      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart data={stats.monthlyRevenueData} />
        </div>
        <div>
          <RecentActivityCard activities={[]} />
        </div>
      </div>
      
      {/* Status Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatusDonutChart 
          title="Project Status Distribution" 
          data={stats.projectStatus} 
        />
        <StatusDonutChart 
          title="Invoice Payment Status" 
          data={[
            { status: 'Paid', count: stats.paidInvoices },
            { status: 'Pending', count: Math.max(0, stats.totalCustomers - stats.paidInvoices) },
          ]} 
        />
      </div>

      {/* Business Insights Section */}
      <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            <TranslatedText text="Business Insights" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue">
            <TabsList className="mb-6">
              <TabsTrigger value="revenue">
                <TranslatedText text="Revenue Analysis" />
              </TabsTrigger>
              <TabsTrigger value="projects">
                <TranslatedText text="Project Performance" />
              </TabsTrigger>
              <TabsTrigger value="clients">
                <TranslatedText text="Client Overview" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="revenue">
              <div className="space-y-4">
                <div className="p-6 border rounded-lg bg-white shadow-sm">
                  <h3 className="font-semibold mb-3 text-gray-800">
                    <TranslatedText text="Revenue Trend Analysis" />
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your revenue data shows {stats.monthlyRevenue > 0 ? 'positive growth' : 'no revenue recorded'} for the selected period.
                  </p>
                  <div className="h-64">
                    <RevenueChart data={stats.monthlyRevenueData} showAnalysis={true} />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="projects">
              <div className="p-6 border rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold mb-3 text-gray-800">
                  <TranslatedText text="Project Performance Overview" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.activeProjects}</div>
                    <div className="text-sm text-blue-800">Active Projects</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.completedProjects}</div>
                    <div className="text-sm text-green-800">Completed Projects</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.pendingTasks}</div>
                    <div className="text-sm text-purple-800">Pending Tasks</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="clients">
              <div className="p-6 border rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold mb-3 text-gray-800">
                  <TranslatedText text="Client Management Summary" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">{stats.totalCustomers}</div>
                    <div className="text-gray-600">Total customers in database</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeCustomers}</div>
                    <div className="text-gray-600">Active customers</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
