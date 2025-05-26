
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckSquare, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';

interface TodayTask {
  id: string;
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  assigned_to?: string;
  due_date?: string;
}

interface TodayMeeting {
  id: string;
  subject: string;
  start_time?: string;
  end_time?: string;
  participants?: string[];
  location?: string;
  meeting_date?: string;
}

interface TodayInvoice {
  id: string;
  number: string;
  total: number;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const TodayOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currencySymbol } = useAppSettings();
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  
  const [todaysTasks, setTodaysTasks] = useState<TodayTask[]>([]);
  const [todaysMeetings, setTodaysMeetings] = useState<TodayMeeting[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<TodayInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchTodayData = async () => {
      try {
        setLoading(true);
        
        // Fetch today's tasks (due today or overdue)
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .lte('due_date', todayString)
          .neq('status', 'completed');
          
        // Fetch today's meetings
        const { data: meetings } = await supabase
          .from('meetings')
          .select('*')
          .eq('meeting_date', todayString);
          
        // Fetch pending/overdue invoices
        const { data: invoices } = await supabase
          .from('invoices')
          .select('*')
          .in('status', ['sent', 'overdue']);
        
        setTodaysTasks(tasks?.map(task => ({
          id: task.id,
          name: task.name,
          description: task.description || '',
          priority: (task.priority as 'low' | 'medium' | 'high') || 'medium',
          status: (task.status as 'todo' | 'in-progress' | 'completed') || 'todo',
          assigned_to: task.assigned_to || '',
          due_date: task.due_date || '',
        })) || []);
        
        setTodaysMeetings(meetings?.map(meeting => ({
          id: meeting.id,
          subject: meeting.subject,
          start_time: meeting.start_time || '',
          end_time: meeting.end_time || '',
          participants: meeting.participants || [],
          location: meeting.location || '',
          meeting_date: meeting.meeting_date || '',
        })) || []);
        
        setPendingInvoices(invoices?.map(invoice => ({
          id: invoice.id,
          number: invoice.number,
          total: Number(invoice.total),
          due_date: invoice.due_date,
          status: invoice.status as 'draft' | 'sent' | 'paid' | 'overdue',
        })) || []);
        
      } catch (error) {
        console.error('Error fetching today data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTodayData();
  }, [user, todayString]);
  
  const getStatusColor = (status: string) => {
    const colors = {
      todo: "bg-slate-400",
      "in-progress": "bg-blue-400",
      review: "bg-amber-400",
      completed: "bg-green-400",
      draft: "bg-slate-400",
      sent: "bg-blue-400",
      paid: "bg-green-400",
      overdue: "bg-red-400"
    };
    return colors[status as keyof typeof colors] || "bg-slate-400";
  };
  
  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-slate-400",
      medium: "bg-amber-400",
      high: "bg-red-400"
    };
    return colors[priority as keyof typeof colors] || "bg-slate-400";
  };
  
  if (!user) {
    return (
      <PageContainer>
        <PageHeader 
          title="Today's Overview"
          description="Please log in to view your daily overview"
        />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader 
        title="Today's Overview"
        description={format(today, "EEEE, MMMM d, yyyy")}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Today's Tasks
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={() => navigate('/tasks')}>
              View All Tasks
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-6">Loading tasks...</p>
            ) : todaysTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No tasks due today</p>
            ) : (
              <div className="space-y-4">
                {todaysTasks.map(task => (
                  <div key={task.id} className="flex items-start justify-between border-b pb-3">
                    <div>
                      <h4 className="font-medium">{task.name}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      {task.assigned_to && (
                        <p className="text-xs text-muted-foreground">Assigned to: {task.assigned_to}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)} variant="secondary">
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)} variant="secondary">
                        {task.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Today's Meetings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Meetings
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={() => navigate('/meetings')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-6">Loading meetings...</p>
            ) : todaysMeetings.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No meetings scheduled for today</p>
            ) : (
              <div className="space-y-4">
                {todaysMeetings.map(meeting => (
                  <div key={meeting.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{meeting.subject}</h4>
                      {meeting.start_time && meeting.end_time && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {meeting.start_time} - {meeting.end_time}
                        </Badge>
                      )}
                    </div>
                    {meeting.location && (
                      <p className="text-sm text-muted-foreground">
                        Location: {meeting.location}
                      </p>
                    )}
                    {meeting.participants && meeting.participants.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Participants: {meeting.participants.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Pending Invoices */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pending & Overdue Invoices
          </CardTitle>
          <Button size="sm" variant="ghost" onClick={() => navigate('/invoices')}>
            View All Invoices
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-6">Loading invoices...</p>
          ) : pendingInvoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No pending or overdue invoices</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pendingInvoices.map(invoice => (
                <div key={invoice.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">Invoice #{invoice.number}</h4>
                    <Badge className={getStatusColor(invoice.status)} variant="secondary">
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{currencySymbol}{invoice.total}</span>
                    <span className="text-sm text-muted-foreground">
                      Due: {format(new Date(invoice.due_date), 'PP')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Button className="h-auto flex flex-col py-6" onClick={() => navigate('/tasks')}>
          <CheckSquare className="h-10 w-10 mb-2" />
          <span>Manage Tasks</span>
        </Button>
        <Button className="h-auto flex flex-col py-6" onClick={() => navigate('/meetings')}>
          <Calendar className="h-10 w-10 mb-2" />
          <span>Schedule Meeting</span>
        </Button>
        <Button className="h-auto flex flex-col py-6" onClick={() => navigate('/invoices')}>
          <FileText className="h-10 w-10 mb-2" />
          <span>Create Invoice</span>
        </Button>
        <Button className="h-auto flex flex-col py-6" onClick={() => navigate('/projects')}>
          <Calendar className="h-10 w-10 mb-2" />
          <span>View Projects</span>
        </Button>
      </div>
    </PageContainer>
  );
};

export default TodayOverview;
