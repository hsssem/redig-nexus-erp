
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
  DialogTrigger,
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
import { UserPlus, Plus, Trash2, RefreshCw, UserCheck } from 'lucide-react';
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

// Lead schema
const leadSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().optional(),
  source: z.string().min(1, { message: "Source is required" }),
  percentage: z.number().min(0).max(100),
  estimatedBudget: z.number().min(0),
  notes: z.string().optional(),
  positiveQualities: z.string().optional(),
  negativeQualities: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});

type Lead = z.infer<typeof leadSchema>;

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
  const { addDeletedItem } = useAppSettings();
  const { toast } = useToast();
  
  const form = useForm<Lead>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      source: "",
      percentage: 10,
      estimatedBudget: 0,
      notes: "",
      positiveQualities: "",
      negativeQualities: "",
      createdAt: new Date(),
    },
  });

  // Mock data for demonstration - in real app, this would come from an API
  useEffect(() => {
    setLeads([
      {
        name: "ABC Corporation",
        email: "contact@abc.com",
        phone: "123-456-7890",
        source: "Website",
        percentage: 60,
        estimatedBudget: 5000,
        notes: "Interested in our services",
        positiveQualities: "Good communication, quick responses",
        negativeQualities: "Limited budget",
        createdAt: new Date(),
      },
      {
        name: "XYZ Inc",
        email: "info@xyz.com",
        phone: "987-654-3210",
        source: "Referral",
        percentage: 80,
        estimatedBudget: 10000,
        notes: "Referred by an existing client",
        positiveQualities: "Clear requirements, established business",
        negativeQualities: "Tight deadline",
        createdAt: new Date(),
      },
    ]);
  }, []);

  const onSubmit = (values: Lead) => {
    setLeads(prev => [...prev, { ...values, createdAt: new Date() }]);
    setOpen(false);
    form.reset();
    toast({
      title: "Lead Added",
      description: `${values.name} has been added as a lead.`,
    });
  };

  const handleDelete = (lead: Lead) => {
    addDeletedItem('lead', lead.email, lead.name, lead);
    setLeads(prev => prev.filter(l => l.email !== lead.email));
    toast({
      title: "Lead Deleted",
      description: `${lead.name} has been moved to trash.`,
    });
  };

  const convertToCustomer = (lead: Lead) => {
    // In a real app, you would create a customer based on lead data
    // and possibly connect to an API
    toast({
      title: "Lead Converted",
      description: `${lead.name} has been converted to a customer.`,
    });
    // Remove from leads list
    setLeads(prev => prev.filter(l => l.email !== lead.email));
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-amber-500";
    return "bg-green-500";
  };

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Enter the details of the potential customer.
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
                        defaultValue={field.value}
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
                          defaultValue={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedBudget"
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
                name="positiveQualities"
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
                name="negativeQualities"
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
                <Button type="submit">Add Lead</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {leads.length === 0 ? (
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
                <TableHead className="w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.email}>
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
                  <TableCell>${lead.estimatedBudget}</TableCell>
                  <TableCell>{format(new Date(lead.createdAt), 'PP')}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-2">
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
