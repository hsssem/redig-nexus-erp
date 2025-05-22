
import React, { useState } from 'react';
import { Search, PlusCircle, Calendar, Users, Tag, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { projects, Project } from '@/services/mockData';
import Sidebar from '@/components/layout/Sidebar';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { format } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  client: z.string().min(1, "Client is required"),
  status: z.enum(["active", "completed", "on-hold", "potential", "okGiven", "projectStarted", "betaVersion", "launchedAndVerified"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  progress: z.number().min(0).max(100),
  manager: z.string().min(1, "Manager is required"),
  team: z.array(z.string()).min(1, "At least one team member is required"),
  hours: z.number().min(0, "Hours cannot be negative"),
  isPaid: z.boolean()
});

type FormValues = z.infer<typeof formSchema>;

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projectsList, setProjectsList] = useState(projects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      client: '',
      status: 'potential',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: '',
      budget: 0,
      progress: 0,
      manager: '',
      team: [],
      hours: 0,
      isPaid: false
    }
  });

  const handleCreateProject = (data: FormValues) => {
    // Calculate days based on hours (1 day = 6 hours)
    const days = data.hours / 6;
    
    // Ensure all required properties are populated
    const newProject: Project = {
      id: `${projectsList.length + 1}`,
      name: data.name,
      description: data.description,
      client: data.client,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: data.budget,
      progress: data.progress,
      manager: data.manager,
      team: data.team,
      hours: data.hours,
      days: days,
      isPaid: data.isPaid
    };
    
    setProjectsList([...projectsList, newProject]);
    toast.success("Project created successfully");
    setIsCreateDialogOpen(false);
  };

  const handleUpdateProject = (data: FormValues) => {
    if (selectedProject) {
      // Calculate days based on hours (1 day = 6 hours)
      const days = data.hours / 6;
      
      const updatedList = projectsList.map(project => 
        project.id === selectedProject.id 
          ? { 
              ...project,
              name: data.name,
              description: data.description,
              client: data.client,
              status: data.status,
              startDate: data.startDate,
              endDate: data.endDate,
              budget: data.budget,
              progress: data.progress,
              manager: data.manager,
              team: data.team,
              hours: data.hours,
              days: days,
              isPaid: data.isPaid
            } 
          : project
      );
      
      setProjectsList(updatedList);
      toast.success("Project updated successfully");
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteProject = (id: string) => {
    const updatedList = projectsList.filter(project => project.id !== id);
    setProjectsList(updatedList);
    toast.success("Project deleted successfully");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'on-hold':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">On Hold</Badge>;
      case 'potential':
        return <Badge className="bg-purple-300 hover:bg-purple-400">Potential</Badge>;
      case 'okGiven':
        return <Badge className="bg-green-300 hover:bg-green-400">OK Given</Badge>;
      case 'projectStarted':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Project Started</Badge>;
      case 'betaVersion':
        return <Badge className="bg-indigo-400 hover:bg-indigo-500">Beta Version</Badge>;
      case 'launchedAndVerified':
        return <Badge className="bg-sky-500 hover:bg-sky-600">Launched & Verified</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'okGiven':
        return 'OK Given';
      case 'projectStarted':
        return 'Project Started';
      case 'betaVersion':
        return 'Beta Version';
      case 'launchedAndVerified':
        return 'Launched & Verified';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');
    }
  };

  const filteredProjects = projectsList.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openViewDialog = (project: Project) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    form.reset({
      name: project.name,
      description: project.description,
      client: project.client,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate || '',
      budget: project.budget || 0,
      progress: project.progress,
      manager: project.manager,
      team: project.team,
      hours: project.hours,
      isPaid: project.isPaid
    });
    setIsEditDialogOpen(true);
  };

  // Team members for selection in the form
  const teamMembers = [
    "Alice Cooper",
    "Bob Thompson",
    "Charlie Martinez",
    "Dana Johnson",
    "Evan Williams",
    "Frank Miller",
    "Grace Lee"
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <PageContainer className="flex-1">
        <PageHeader
          title="Projects"
          description="Manage your projects portfolio"
        />

        <Card className="shadow-md backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Add a new project to your portfolio
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateProject)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter project name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Project description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="client"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Client</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select client" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="TechCorp Inc.">TechCorp Inc.</SelectItem>
                                  <SelectItem value="Innovate Co">Innovate Co</SelectItem>
                                  <SelectItem value="DataFlow Systems">DataFlow Systems</SelectItem>
                                  <SelectItem value="WebWorks">WebWorks</SelectItem>
                                  <SelectItem value="Global Technologies">Global Technologies</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="potential">Potential</SelectItem>
                                  <SelectItem value="okGiven">OK Given</SelectItem>
                                  <SelectItem value="projectStarted">Project Started</SelectItem>
                                  <SelectItem value="betaVersion">Beta Version</SelectItem>
                                  <SelectItem value="launchedAndVerified">Launched & Verified</SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="on-hold">On Hold</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date (Optional)</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Budget (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Budget amount" 
                                  {...field}
                                  onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="progress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Progress (%)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  max="100" 
                                  {...field}
                                  onChange={e => field.onChange(Number(e.target.value))} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="hours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hours</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  placeholder="Project hours" 
                                  {...field}
                                  onChange={e => field.onChange(Number(e.target.value))} 
                                />
                              </FormControl>
                              <FormMessage />
                              <p className="text-xs text-muted-foreground">
                                Days: {(field.value / 6).toFixed(1)} (Calculated as hours ÷ 6)
                              </p>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="isPaid"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-8">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  className="h-4 w-4"
                                  checked={field.value}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                />
                              </FormControl>
                              <FormLabel>Project is paid</FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="manager"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Manager</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select manager" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {teamMembers.map((member) => (
                                  <SelectItem key={member} value={member}>
                                    {member}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="team"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Members</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange([...field.value, value])}
                              value={undefined}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Add team members" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {teamMembers
                                  .filter(member => !field.value.includes(member))
                                  .map((member) => (
                                    <SelectItem key={member} value={member}>
                                      {member}
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                            
                            <div className="mt-2 flex flex-wrap gap-2">
                              {field.value.map((member, index) => (
                                <Badge key={index} variant="outline" className="py-1 px-2">
                                  {member}
                                  <button 
                                    type="button" 
                                    className="ml-2 text-muted-foreground hover:text-foreground" 
                                    onClick={() => {
                                      const newTeam = [...field.value];
                                      newTeam.splice(index, 1);
                                      field.onChange(newTeam);
                                    }}
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit" className="bg-gradient-primary">Create Project</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hours/Days</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.client}</TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell>{project.hours}h / {project.days.toFixed(1)}d</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={project.progress} className="h-2" />
                            <span className="text-xs">{project.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{project.manager}</TableCell>
                        <TableCell>
                          {project.isPaid ? 
                            <Badge className="bg-green-500">Paid</Badge> : 
                            <Badge className="bg-orange-500">Unpaid</Badge>
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => openViewDialog(project)}>
                              View
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(project)}>
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No projects found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* View Project Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">{selectedProject.name}</DialogTitle>
                  <DialogDescription>
                    {getStatusBadge(selectedProject.status)}
                    {selectedProject.isPaid ? 
                      <Badge className="ml-2 bg-green-500">Paid</Badge> : 
                      <Badge className="ml-2 bg-orange-500">Unpaid</Badge>
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p>{selectedProject.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                      <p>{selectedProject.client}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Project Manager</h3>
                      <p>{selectedProject.manager}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                      <p>{selectedProject.startDate}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                      <p>{selectedProject.endDate || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
                      <p>${selectedProject.budget?.toLocaleString() || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Hours/Days</h3>
                      <p>{selectedProject.hours}h / {selectedProject.days.toFixed(1)}d</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={selectedProject.progress} className="h-2 flex-1" />
                        <span className="text-xs">{selectedProject.progress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Team Members</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.team.map((member, index) => (
                        <Badge key={index} variant="outline" className="py-1 px-2">
                          {member}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                  <Button className="bg-gradient-primary" onClick={() => openEditDialog(selectedProject)}>
                    Edit Project
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Project Dialog - Similar to Create Dialog but with pre-filled values */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update the project details
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateProject)} className="space-y-4">
                {/* Same form fields as Create Dialog, but pre-filled with selectedProject values */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Project description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TechCorp Inc.">TechCorp Inc.</SelectItem>
                            <SelectItem value="Innovate Co">Innovate Co</SelectItem>
                            <SelectItem value="DataFlow Systems">DataFlow Systems</SelectItem>
                            <SelectItem value="WebWorks">WebWorks</SelectItem>
                            <SelectItem value="Global Technologies">Global Technologies</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="potential">Potential</SelectItem>
                            <SelectItem value="okGiven">OK Given</SelectItem>
                            <SelectItem value="projectStarted">Project Started</SelectItem>
                            <SelectItem value="betaVersion">Beta Version</SelectItem>
                            <SelectItem value="launchedAndVerified">Launched & Verified</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Rest of form fields - same as Create Dialog */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Budget amount" 
                            {...field}
                            value={field.value || ''}
                            onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="progress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Progress (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Manager</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select manager" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teamMembers.map((member) => (
                            <SelectItem key={member} value={member}>
                              {member}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Members</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange([...field.value, value])}
                        value={undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Add team members" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teamMembers
                            .filter(member => !field.value.includes(member))
                            .map((member) => (
                              <SelectItem key={member} value={member}>
                                {member}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        {field.value.map((member, index) => (
                          <Badge key={index} variant="outline" className="py-1 px-2">
                            {member}
                            <button 
                              type="button" 
                              className="ml-2 text-muted-foreground hover:text-foreground" 
                              onClick={() => {
                                const newTeam = [...field.value];
                                newTeam.splice(index, 1);
                                field.onChange(newTeam);
                              }}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" className="bg-gradient-primary">Update Project</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

      </PageContainer>
    </div>
  );
};

export default Projects;
