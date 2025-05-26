import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserPlus, Plus, Trash2, UserCheck, Edit } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Lead schema
const leadSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().optional(),
  source: z.string().min(1, { message: "Source is required" }),
  percentage: z.number().min(0).max(100),
  estimated_budget: z.number().min(0),
  notes: z.string().optional(),
  positive_qualities: z.string().optional(),
  negative_qualities: z.string().optional(),
});

type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  percentage: number;
  estimated_budget: number;
  notes?: string;
  positive_qualities?: string;
  negative_qualities?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
};

const leadSources = [
  "Website",
  "Referral",
  "Social Media",
  "Direct Contact",
  "Email Campaign",
  "Trade Show",
  "Other"
];

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [open, setOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addDeletedItem } = useAppSettings();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      source: "",
      percentage: 10,
      estimated_budget: 0,
      notes: "",
      positive_qualities: "",
      negative_qualities: "",
    },
  });

  // Fetch leads from Supabase
  const fetchLeads = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        toast({
          title: "Error",
          description: "Failed to fetch leads",
          variant: "destructive",
        });
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user]);

  const onSubmit = async (values: z.infer<typeof leadSchema>) => {
    if (!user) return;

    try {
      if (editingLead) {
        // Update existing lead
        const { error } = await supabase
          .from('leads')
          .update({
            name: values.name,
            email: values.email,
            phone: values.phone,
            source: values.source,
            percentage: values.percentage,
            estimated_budget: values.estimated_budget,
            notes: values.notes,
            positive_qualities: values.positive_qualities,
            negative_qualities: values.negative_qualities,
          })
          .eq('id', editingLead.id);

        if (error) {
          console.error('Error updating lead:', error);
          toast({
            title: "Error",
            description: "Failed to update lead",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Lead Updated",
          description: `${values.name} has been updated.`,
        });
      } else {
        // Create new lead
        const { error } = await supabase
          .from('leads')
          .insert({
            user_id: user.id,
            name: values.name,
            email: values.email,
            phone: values.phone,
            source: values.source,
            percentage: values.percentage,
            estimated_budget: values.estimated_budget,
            notes: values.notes,
            positive_qualities: values.positive_qualities,
            negative_qualities: values.negative_qualities,
          });

        if (error) {
          console.error('Error creating lead:', error);
          toast({
            title: "Error",
            description: "Failed to create lead",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Lead Added",
          description: `${values.name} has been added as a lead.`,
        });
      }

      setOpen(false);
      setEditingLead(null);
      form.reset();
      fetchLeads();
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: "Error",
        description: "Failed to save lead",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (lead: Lead) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', lead.id);

      if (error) {
        console.error('Error deleting lead:', error);
        toast({
          title: "Error",
          description: "Failed to delete lead",
          variant: "destructive",
        });
        return;
      }

      addDeletedItem('lead', lead.email, lead.name, lead);
      toast({
        title: "Lead Deleted",
        description: `${lead.name} has been moved to trash.`,
      });
      
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    }
  };

  const convertToCustomer = async (lead: Lead) => {
    try {
      // Create customer record in clients table
      const { error } = await supabase
        .from('clients')
        .insert({
          user_id: user?.id,
          company_name: lead.name,
          notes: `Converted from lead. Original notes: ${lead.notes || ''}. Phone: ${lead.phone || 'N/A'}. Email: ${lead.email}`,
          classification: 'Customer',
          manager: 'Not Assigned',
          industry: 'Unknown',
        });

      if (error) {
        console.error('Error converting lead to customer:', error);
        toast({
          title: "Error",
          description: "Failed to convert lead to customer",
          variant: "destructive",
        });
        return;
      }

      // Remove from leads after successful conversion
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', lead.id);

      if (deleteError) {
        console.error('Error deleting lead after conversion:', deleteError);
        toast({
          title: "Warning",
          description: "Customer created but lead wasn't removed",
          variant: "destructive",
        });
        return;
      }
      
      await fetchLeads();
      toast({
        title: "Lead Converted",
        description: `${lead.name} has been converted to a customer.`,
      });
    } catch (error) {
      console.error('Error converting lead:', error);
      toast({
        title: "Error",
        description: "Failed to convert lead",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    form.setValue('name', lead.name);
    form.setValue('email', lead.email);
    form.setValue('phone', lead.phone || '');
    form.setValue('source', lead.source);
    form.setValue('percentage', lead.percentage);
    form.setValue('estimated_budget', lead.estimated_budget);
    form.setValue('notes', lead.notes || '');
    form.setValue('positive_qualities', lead.positive_qualities || '');
    form.setValue('negative_qualities', lead.negative_qualities || '');
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditingLead(null);
    form.reset();
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-amber-500";
    return "bg-green-500";
  };

  if (!user) {
    return (
      <PageContainer>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="mt-4 text-lg font-medium">Please log in</h3>
            <p className="text-muted-foreground">You need to be logged in to view leads</p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Leads Management"
        description="Track and manage potential customers"
        action={{
          label: "Add Lead",
          onClick: () => setOpen(true),
        }}
      />

      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
            <DialogDescription>
              {editingLead ? 'Update the lead information.' : 'Enter the details of the potential customer.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Lead name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {leadSources.map(source => (
                            <SelectItem key={source} value={source}>
                              {source}
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
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conversion Probability: {field.value}%</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimated_budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Budget</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Budget amount" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional information" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positive_qualities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Positive Qualities</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Strengths and positive aspects" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="negative_qualities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Negative Qualities</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Concerns or negative aspects" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">
                  {editingLead ? 'Update Lead' : 'Add Lead'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground">Loading leads...</div>
          </CardContent>
        </Card>
      ) : leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserPlus className="h-16 w-16 text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-lg font-medium">No Leads Yet</h3>
            <p className="text-muted-foreground">Add a lead to get started</p>
            <Button className="mt-4" onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Lead
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <div>{lead.email}</div>
                    <div className="text-sm text-muted-foreground">{lead.phone}</div>
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-full">
                        <Progress value={lead.percentage} className={getProgressColor(lead.percentage)} />
                      </div>
                      <div className="min-w-[32px] text-right">{lead.percentage}%</div>
                    </div>
                  </TableCell>
                  <TableCell>${lead.estimated_budget}</TableCell>
                  <TableCell>{format(new Date(lead.created_at), 'PP')}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleEdit(lead)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => convertToCustomer(lead)}
                      >
                        <UserCheck className="h-4 w-4" />
                        <span className="hidden sm:inline">Convert</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(lead)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
};

export default Leads;
