
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckSquare, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { invoices } from '@/services/mockData';
import { Badge } from '@/components/ui/badge';

// Types for today's overview data
interface TodayTask {
  id: string;
  title: string;
  project: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
}

interface TodayMeeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  participants: string[];
}

interface TodayInvoice {
  id: string;
  client: string;
  amount: number;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const TodayOverview: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [todaysTasks, setTodaysTasks] = useState<TodayTask[]>([]);
  const [todaysMeetings, setTodaysMeetings] = useState<TodayMeeting[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<TodayInvoice[]>([]);
  
  useEffect(() => {
    // In a real app, these would come from API calls
    // But for this demo, we'll use mock data
    
    // Mock tasks for today
    setTodaysTasks([
      {
        id: "task1",
        title: "Finalize project proposal",
        project: "Website Redesign",
        priority: "high",
        status: "in-progress"
      },
      {
        id: "task2",
        title: "Client call preparation",
        project: "Mobile App Development",
        priority: "medium",
        status: "todo"
      },
      {
        id: "task3",
        title: "Review code changes",
        project: "E-commerce Platform",
        priority: "medium",
        status: "review"
      }
    ]);
    
    // Mock meetings for today
    setTodaysMeetings([
      {
        id: "meet1",
        title: "Weekly Team Standup",
        startTime: "09:00",
        endTime: "09:30",
        participants: ["John", "Sarah", "Michael"]
      },
      {
        id: "meet2",
        title: "Client Progress Review",
        startTime: "13:00",
        endTime: "14:00",
        participants: ["Client A", "Project Manager", "Lead Developer"]
      }
    ]);
    
    // Get pending/overdue invoices from mock data
    const overduePending = invoices.filter(inv => 
      inv.status === 'sent' || inv.status === 'overdue'
    ).map(inv => ({
      id: inv.id,
      client: inv.customer,
      amount: inv.total,
      dueDate: new Date(inv.dueDate),
      status: inv.status
    }));
    
    setPendingInvoices(overduePending);
  }, []);
  
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
            {todaysTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No tasks scheduled for today</p>
            ) : (
              <div className="space-y-4">
                {todaysTasks.map(task => (
                  <div key={task.id} className="flex items-start justify-between border-b pb-3">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.project}</p>
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
            {todaysMeetings.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No meetings scheduled for today</p>
            ) : (
              <div className="space-y-4">
                {todaysMeetings.map(meeting => (
                  <div key={meeting.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{meeting.title}</h4>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {meeting.startTime} - {meeting.endTime}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {meeting.participants.join(", ")}
                    </p>
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
          {pendingInvoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No pending or overdue invoices</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pendingInvoices.map(invoice => (
                <div key={invoice.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{invoice.client}</h4>
                    <Badge className={getStatusColor(invoice.status)} variant="secondary">
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">${invoice.amount}</span>
                    <span className="text-sm text-muted-foreground">
                      Due: {format(new Date(invoice.dueDate), 'PP')}
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
