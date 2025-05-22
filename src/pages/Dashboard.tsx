
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import StatsCard from '@/components/layout/StatsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import StatusDonutChart from '@/components/dashboard/StatusDonutChart';
import { statistics, invoices } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Users, FileText, BriefcaseBusiness, CheckSquare } from 'lucide-react';

// Define a helper function to ensure type safety
const getTypeCheckedActivities = () => {
  return statistics.recentActivity.map(activity => {
    // Ensure the type is one of the valid types
    const validType = (activity.type === 'invoice' || 
                        activity.type === 'customer' || 
                        activity.type === 'project' || 
                        activity.type === 'task' || 
                        activity.type === 'meeting') 
                      ? activity.type 
                      : 'task'; // Default fallback if type is invalid
    
    return {
      ...activity,
      type: validType
    };
  });
};

const Dashboard = () => {
  const { user } = useAuth();
  
  // Get type-checked activities
  const typeSafeActivities = getTypeCheckedActivities();
  
  return (
    <PageContainer>
      <PageHeader 
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`} 
        description="Here's an overview of your business"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Customers"
          value={statistics.totalCustomers}
          icon={<Users className="h-6 w-6 text-primary" />}
          description={`${statistics.activeCustomers} active`}
        />
        <StatsCard
          title="Total Invoices"
          value={`$${statistics.invoiceValue.toLocaleString()}`}
          icon={<FileText className="h-6 w-6 text-primary" />}
          description={`${statistics.totalInvoices} invoices`}
        />
        <StatsCard
          title="Active Projects"
          value={statistics.activeProjects}
          icon={<BriefcaseBusiness className="h-6 w-6 text-primary" />}
          description={`${statistics.totalProjects} total`}
        />
        <StatsCard
          title="Pending Tasks"
          value={statistics.pendingTasks}
          icon={<CheckSquare className="h-6 w-6 text-primary" />}
          description="Across all projects"
        />
      </div>
      
      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={statistics.monthlyRevenue} />
        </div>
        <div>
          <RecentActivityCard activities={typeSafeActivities} />
        </div>
      </div>
      
      {/* Status Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <StatusDonutChart 
          title="Project Status" 
          data={statistics.projectStatus} 
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
    </PageContainer>
  );
};

export default Dashboard;
