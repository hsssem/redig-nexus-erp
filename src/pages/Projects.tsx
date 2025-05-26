import React, { useState } from 'react';
import { Search, PlusCircle, Calendar, Users, Tag, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
import { useProjects, Project } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { useAppSettings } from '@/contexts/AppSettingsContext';

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  status: z.enum(["active", "completed", "on_hold"]),
  client_id: z.string().optional(),
  manager: z.string().optional(),
  budget: z.number().optional(),
  duration_days: z.number().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { clients } = useClients();
  const { addDeletedItem } = useAppSettings();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      status: 'active',
      client_id: '',
      manager: '',
      budget: undefined,
      duration_days: undefined,
      notes: '',
    }
  });

  const handleCreateProject = async (data: FormValues) => {
    const success = await createProject(data);
    if (success) {
      setIsCreateDialogOpen(false);
      form.reset();
    }
  };

  const handleUpdateProject = async (data: FormValues) => {
    if (selectedProject) {
      const success = await updateProject(selectedProject.id, data);
      if (success) {
        setIsEditDialogOpen(false);
        setSelectedProject(null);
        form.reset();
      }
    }
  };

  const handleDeleteProject = async (project: Project) => {
    const success = await deleteProject(project.id);
    if (success) {
      addDeletedItem({
        id: project.id,
        name: project.name,
        type: 'project',
        data: project,
        deletedAt: new Date().toISOString(),
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'on_hold':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">On Hold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openViewDialog = (project: Project) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    form.reset({
      name: project.name,
      status: project.status,
      client_id: project.client_id || '',
      manager: project.manager || '',
      budget: project.budget || undefined,
      duration_days: project.duration_days || undefined,
      notes: project.notes || '',
    });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Projects" description="Loading projects..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        description="Manage your projects portfolio"
        action={{
          label: "Add Project",
          onClick: () => setIsCreateDialogOpen(true),
        }}
      >
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </PageHeader>

      <Card className="shadow-md backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{getStatusBadge(project.status || 'active')}</TableCell>
                      <TableCell>{project.manager || '-'}</TableCell>
                      <TableCell>${project.budget?.toLocaleString() || '-'}</TableCell>
                      <TableCell>{project.duration_days ? `${project.duration_days} days` : '-'}</TableCell>
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
                            onClick={() => handleDeleteProject(project)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No projects found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
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
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.company_name}
                            </SelectItem>
                          ))}
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
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
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
                  name="duration_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (days)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Project duration" 
                          {...field}
                          value={field.value || ''}
                          onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} 
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
                    <FormControl>
                      <Input placeholder="Manager name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Project notes" {...field} />
                    </FormControl>
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

      {/* View Project Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{selectedProject.name}</DialogTitle>
                <DialogDescription>
                  {getStatusBadge(selectedProject.status || 'active')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Manager</h3>
                    <p>{selectedProject.manager || 'Not assigned'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
                    <p>${selectedProject.budget?.toLocaleString() || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                    <p>{selectedProject.duration_days ? `${selectedProject.duration_days} days` : 'Not set'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                    <p>{format(new Date(selectedProject.created_at), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                
                {selectedProject.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                    <p className="text-sm">{selectedProject.notes}</p>
                  </div>
                )}
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

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project details
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateProject)} className="space-y-4">
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
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.company_name}
                            </SelectItem>
                          ))}
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
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
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
                  name="duration_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (days)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Project duration" 
                          {...field}
                          value={field.value || ''}
                          onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} 
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
                    <FormControl>
                      <Input placeholder="Manager name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Project notes" {...field} />
                    </FormControl>
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
  );
};

export default Projects;
