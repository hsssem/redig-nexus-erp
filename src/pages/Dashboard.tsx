
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import StatsCard from '@/components/layout/StatsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import StatusDonutChart from '@/components/dashboard/StatusDonutChart';
import { invoices, calculateStatistics } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Users, FileText, BriefcaseBusiness, CheckSquare, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define the ActivityItem type to match what's expected in RecentActivityCard
type ActivityType = 'invoice' | 'customer' | 'project' | 'task' | 'meeting';

// Define a helper function to ensure type safety
const getTypeCheckedActivities = (activities: any[]) => {
  return activities.map(activity => {
    // Ensure the type is one of the valid types
    const validType = (activity.type === 'invoice' || 
                      activity.type === 'customer' || 
                      activity.type === 'project' || 
                      activity.type === 'task' || 
                      activity.type === 'meeting') 
                    ? activity.type as ActivityType 
                    : 'task' as ActivityType; 
    
    return {
      ...activity,
      type: validType
    };
  });
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 
  'August', 'September', 'October', 'November', 'December'
];

const Dashboard = () => {
  const { user } = useAuth();
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [stats, setStats] = useState(calculateStatistics(currentMonth));
  
  useEffect(() => {
    // Recalculate statistics when the selected month changes
    setStats(calculateStatistics(selectedMonth));
  }, [selectedMonth]);
  
  // Get type-checked activities
  const typeSafeActivities = getTypeCheckedActivities(stats.recentActivity);

  // Get user display name from Supabase user object
  const getUserDisplayName = () => {
    if (!user) return 'User';
    const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    return displayName.split(' ')[0]; // Get first name
  };

  const handleMonthChange = (monthIndex: string) => {
    setSelectedMonth(parseInt(monthIndex));
  };
  
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
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6 text-darkblue-500" />}
          description={`${stats.thisMonthProjects} projects`}
          className="gradient-card"
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
          <RecentActivityCard activities={typeSafeActivities} />
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
            { status: 'Paid', count: invoices.filter(i => i.status === 'paid').length },
            { status: 'Pending', count: invoices.filter(i => i.status === 'sent').length },
            { status: 'Overdue', count: invoices.filter(i => i.status === 'overdue').length }
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
                    <h3 className="font-medium mb-2">Revenue by Month</h3>
                    <p className="text-muted-foreground mb-3">Based on your data, May has been your highest revenue month ($21,000).</p>
                    <div className="h-64">
                      <RevenueChart data={stats.monthlyRevenueData} showAnalysis={true} />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="projects">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-medium">Team Performance</h3>
                    <p className="text-muted-foreground mb-3">Alice Cooper's team has completed 2 projects, generating the highest revenue.</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Alice Cooper</span>
                        <span className="font-medium">$40,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Bob Thompson</span>
                        <span className="font-medium">$35,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Evan Williams</span>
                        <span className="font-medium">$30,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="clients">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-medium">Top Clients by Revenue</h3>
                    <p className="text-muted-foreground mb-3">DataFlow Systems is your highest-value client with projects totaling $120,000.</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span>DataFlow Systems</span>
                        <span className="font-medium">$120,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Innovate Co</span>
                        <span className="font-medium">$50,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>TechCorp Inc.</span>
                        <span className="font-medium">$25,000</span>
                      </div>
                    </div>
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
