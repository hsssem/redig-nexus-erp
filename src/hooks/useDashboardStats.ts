
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  monthlyRevenue: number;
  thisMonthProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingTasks: number;
  paidProjects: number;
  unpaidProjects: number;
  paidInvoices: number;
  monthlyRevenueData: { month: string; revenue: number }[];
  projectStatus: { status: string; count: number }[];
  recentActivity: any[];
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    monthlyRevenue: 0,
    thisMonthProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingTasks: 0,
    paidProjects: 0,
    unpaidProjects: 0,
    paidInvoices: 0,
    monthlyRevenueData: [],
    projectStatus: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch clients
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id);

      // Fetch projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);

      // Fetch tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      // Fetch invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id);

      // Fetch payments
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id);

      // Calculate stats
      const totalCustomers = clients?.length || 0;
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
      const pendingTasks = tasks?.filter(t => t.status !== 'completed').length || 0;
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      // Calculate monthly revenue from payments
      const monthlyRevenue = payments?.filter(p => {
        const paymentDate = new Date(p.payment_date);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      }).reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      const paidInvoices = invoices?.filter(i => i.status === 'paid').length || 0;

      // Generate monthly revenue data
      const monthlyRevenueData = Array.from({ length: 12 }, (_, i) => {
        const monthRevenue = payments?.filter(p => {
          const paymentDate = new Date(p.payment_date);
          return paymentDate.getMonth() === i && paymentDate.getFullYear() === currentYear;
        }).reduce((sum, p) => sum + Number(p.amount), 0) || 0;

        return {
          month: new Date(2024, i).toLocaleDateString('en', { month: 'short' }),
          revenue: monthRevenue
        };
      });

      // Project status distribution
      const projectStatus = [
        { status: 'Active', count: activeProjects },
        { status: 'Completed', count: completedProjects },
        { status: 'On Hold', count: projects?.filter(p => p.status === 'on_hold').length || 0 },
      ];

      setStats({
        totalCustomers,
        activeCustomers: totalCustomers, // Assuming all clients are active for now
        monthlyRevenue,
        thisMonthProjects: projects?.filter(p => {
          const createdDate = new Date(p.created_at);
          return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
        }).length || 0,
        activeProjects,
        completedProjects,
        pendingTasks,
        paidProjects: completedProjects, // Assuming completed projects are paid
        unpaidProjects: activeProjects, // Assuming active projects are unpaid
        paidInvoices,
        monthlyRevenueData,
        projectStatus,
        recentActivity: [], // Will be implemented separately if needed
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
};
