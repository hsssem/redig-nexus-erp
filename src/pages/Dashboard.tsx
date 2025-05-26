
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import StatsCard from '@/components/layout/StatsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import StatusDonutChart from '@/components/dashboard/StatusDonutChart';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Users, FileText, BriefcaseBusiness, CheckSquare, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardStats } from '@/hooks/useDashboardStats';

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
        description="Here's an overview of your business"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<Users className="h-6 w-6 text-darkblue-500" />}
          description={`${stats.activeCustomers} active`}
          className="gradient-card"
        />
        <StatsCard
          title={`Revenue (${MONTHS[selectedMonth]})`}
          value={stats.monthlyRevenue}
          icon={<TrendingUp className="h-6 w-6 text-darkblue-500" />}
          description={`${stats.thisMonthProjects} projects`}
          className="gradient-card"
          isMonetary={true}
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<BriefcaseBusiness className="h-6 w-6 text-darkblue-500" />}
          description={`${stats.completedProjects} completed`}
          className="gradient-card"
        />
        <StatsCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={<CheckSquare className="h-6 w-6 text-darkblue-500" />}
          description="Across all projects"
          className="gradient-card"
        />
      </div>
      
      {/* Project Payment Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatsCard
          title="Projects Paid"
          value={stats.paidProjects}
          icon={<FileText className="h-6 w-6 text-green-500" />}
          description={`${stats.paidInvoices} invoices paid`}
          className="bg-gradient-to-br from-green-900/30 to-green-600/30 border border-green-500/50"
        />
        <StatsCard
          title="Projects Unpaid"
          value={stats.unpaidProjects}
          icon={<AlertTriangle className="h-6 w-6 text-amber-500" />}
          description="Waiting for payment"
          className="bg-gradient-to-br from-amber-900/30 to-amber-600/30 border border-amber-500/50"
        />
      </div>
      
      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={stats.monthlyRevenueData} />
        </div>
        <div>
          <RecentActivityCard activities={[]} />
        </div>
      </div>
      
      {/* Status Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <StatusDonutChart 
          title="Project Status" 
          data={stats.projectStatus} 
        />
        <StatusDonutChart 
          title="Invoice Status" 
          data={[
            { status: 'Paid', count: stats.paidInvoices },
            { status: 'Pending', count: Math.max(0, stats.totalCustomers - stats.paidInvoices) },
          ]} 
        />
      </div>

      {/* AI Insights Section */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="text-purple-500">AI</span> Business Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="charts">
              <TabsList className="mb-4">
                <TabsTrigger value="charts">Revenue Analysis</TabsTrigger>
                <TabsTrigger value="projects">Project Performance</TabsTrigger>
                <TabsTrigger value="clients">Client Insights</TabsTrigger>
              </TabsList>
              <TabsContent value="charts">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-medium mb-2">Revenue Trend</h3>
                    <p className="text-muted-foreground mb-3">
                      Your revenue data shows {stats.monthlyRevenue > 0 ? 'positive growth' : 'no revenue'} this month.
                    </p>
                    <div className="h-64">
                      <RevenueChart data={stats.monthlyRevenueData} showAnalysis={true} />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="projects">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-medium">Project Overview</h3>
                    <p className="text-muted-foreground mb-3">
                      You have {stats.activeProjects} active projects and {stats.completedProjects} completed projects.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="clients">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-medium">Client Overview</h3>
                    <p className="text-muted-foreground mb-3">
                      You have {stats.totalCustomers} total customers in your database.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
