
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Calendar, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface QuickStat {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const TodayOverviewWidget: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<QuickStat[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchTodayStats = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        
        // Fetch today's tasks
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .lte('due_date', today)
          .neq('status', 'completed');
          
        // Fetch today's meetings
        const { data: meetings } = await supabase
          .from('meetings')
          .select('*')
          .eq('meeting_date', today);
          
        // Fetch pending invoices
        const { data: invoices } = await supabase
          .from('invoices')
          .select('*')
          .in('status', ['sent', 'overdue']);
        
        setStats([
          {
            label: "Tasks Due",
            value: tasks?.length || 0,
            icon: <CheckSquare size={20} />,
            color: "bg-blue-500"
          },
          {
            label: "Meetings Today",
            value: meetings?.length || 0,
            icon: <Calendar size={20} />,
            color: "bg-green-500"
          },
          {
            label: "Pending Invoices",
            value: invoices?.length || 0,
            icon: <FileText size={20} />,
            color: "bg-amber-500"
          },
          {
            label: "Current Time",
            value: parseInt(format(new Date(), 'HH')),
            icon: <Clock size={20} />,
            color: "bg-purple-500"
          }
        ]);
        
      } catch (error) {
        console.error('Error fetching today stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTodayStats();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="group relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white via-white to-gray-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="relative z-10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TodayOverviewWidget;
