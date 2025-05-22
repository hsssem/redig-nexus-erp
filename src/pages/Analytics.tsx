
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AiAssistant from '@/components/dashboard/AiAssistant';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { projects, customers, teamMembers, invoices } from '@/services/mockData';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  
  // Prepare data for various charts
  const revenueData = [
    { name: 'Jan', amount: 12000 },
    { name: 'Feb', amount: 15000 },
    { name: 'Mar', amount: 18000 },
    { name: 'Apr', amount: 16000 },
    { name: 'May', amount: 21000 },
    { name: 'Jun', amount: 20000 }
  ];
  
  const projectStatusData = [
    { name: 'Completed', value: projects.filter(p => p.status === 'completed' || p.status === 'launchedAndVerified').length },
    { name: 'In Progress', value: projects.filter(p => p.status === 'active' || p.status === 'projectStarted' || p.status === 'betaVersion').length },
    { name: 'On Hold', value: projects.filter(p => p.status === 'on-hold').length },
    { name: 'Potential', value: projects.filter(p => p.status === 'potential' || p.status === 'okGiven').length }
  ];
  
  const clientRevenueData = Array.from(customers.map(customer => {
    // Find all projects for this client
    const clientProjects = projects.filter(project => project.client === customer.company);
    // Calculate total budget for all client projects
    const totalRevenue = clientProjects.reduce((sum, project) => sum + (project.budget || 0), 0);
    
    return {
      name: customer.company,
      value: totalRevenue
    };
  })).sort((a, b) => b.value - a.value);
  
  const teamPerformanceData = Array.from(teamMembers.map(member => {
    // Find all projects managed by this team member
    const managedProjects = projects.filter(project => project.manager === member.name);
    // Calculate total budget for all managed projects
    const totalBudget = managedProjects.reduce((sum, project) => sum + (project.budget || 0), 0);
    // Calculate average project progress
    const avgProgress = managedProjects.length > 0 
      ? managedProjects.reduce((sum, project) => sum + project.progress, 0) / managedProjects.length
      : 0;
    
    return {
      name: member.name,
      budget: totalBudget,
      projects: managedProjects.length,
      progress: avgProgress
    };
  })).sort((a, b) => b.budget - a.budget);
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <PageContainer>
      <PageHeader 
        title="Business Analytics" 
        description="Detailed insights into your business performance"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Key Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="clients">Clients</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
                
                <TabsContent value="revenue" className="h-[400px]">
                  <h3 className="text-lg font-medium mb-4">Monthly Revenue Trend</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis formatter={(value) => `$${value/1000}k`} />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        name="Revenue" 
                        stroke="#9b87f5" 
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#9b87f5" }}
                        activeDot={{ r: 6, fill: "#33C3F0" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="projects" className="h-[400px]">
                  <h3 className="text-lg font-medium mb-4">Project Status Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={projectStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {projectStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="space-y-4">
                        <h4 className="font-medium">Project Status Breakdown</h4>
                        <ul className="space-y-2">
                          {projectStatusData.map((status, index) => (
                            <li key={index} className="flex items-center">
                              <span 
                                className="h-3 w-3 rounded-full mr-2" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                              />
                              <span>{status.name}: {status.value} projects</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-muted-foreground mt-4">
                          {Math.round((projectStatusData[0].value / projects.length) * 100)}% of 
                          projects are completed, with {projectStatusData[1].value} currently in progress.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="clients" className="h-[400px]">
                  <h3 className="text-lg font-medium mb-4">Client Revenue Distribution</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                      data={clientRevenueData}
                      layout="vertical"
                      margin={{
                        top: 5, right: 30, left: 100, bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                      <XAxis type="number" formatter={(value) => `$${value/1000}k`} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                      <Bar dataKey="value" name="Revenue" fill="url(#colorGradient)" />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#9b87f5" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#33C3F0" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="team" className="h-[400px]">
                  <h3 className="text-lg font-medium mb-4">Team Performance</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                      data={teamPerformanceData}
                      margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" formatter={(value) => `$${value/1000}k`} />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="budget" name="Revenue" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="projects" name="Projects" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <AiAssistant />
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Paid vs. Unpaid Projects</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Paid', value: projects.filter(p => p.isPaid).length },
                      { name: 'Unpaid', value: projects.filter(p => !p.isPaid).length }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#82ca9d" />
                    <Cell fill="#ffc658" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Project Value by Payment Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={[
                    { 
                      name: 'Paid', 
                      value: projects
                        .filter(p => p.isPaid)
                        .reduce((sum, project) => sum + (project.budget || 0), 0) 
                    },
                    { 
                      name: 'Unpaid', 
                      value: projects
                        .filter(p => !p.isPaid)
                        .reduce((sum, project) => sum + (project.budget || 0), 0) 
                    }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis formatter={(value) => `$${value/1000}k`} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                  <Bar dataKey="value" name="Project Value">
                    <Cell fill="#82ca9d" />
                    <Cell fill="#ffc658" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default Analytics;
