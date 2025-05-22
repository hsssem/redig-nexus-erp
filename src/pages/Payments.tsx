
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
import { DollarSign, Plus, Trash2, FileText, BriefcaseBusiness } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { invoices } from '@/services/mockData';
import { Badge } from '@/components/ui/badge';

// Payment schema
const paymentSchema = z.object({
  id: z.string().optional(),
  invoiceId: z.string(),
  projectId: z.string(),
  amount: z.number().min(0.01, { message: "Amount must be greater than 0" }),
  date: z.string(),
  method: z.string(),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type Payment = z.infer<typeof paymentSchema>;

const paymentMethods = [
  "Credit Card",
  "Bank Transfer",
  "Cash",
  "Check",
  "PayPal",
  "Other"
];

// Mock data for projects
const projects = [
  { id: "p1", name: "Website Redesign", client: "ABC Corp" },
  { id: "p2", name: "Mobile App Development", client: "XYZ Inc" },
  { id: "p3", name: "Marketing Campaign", client: "123 Industries" }
];

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [open, setOpen] = useState(false);
  const { addDeletedItem, currencySymbol } = useAppSettings();
  const { toast } = useToast();
  
  const form = useForm<Payment>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoiceId: "",
      projectId: "",
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      method: "",
      reference: "",
      notes: "",
    },
  });

  // Mock data for demonstration - in real app, this would come from an API
  useEffect(() => {
    setPayments([
      {
        id: "pay1",
        invoiceId: "inv1",
        projectId: "p1",
        amount: 2500,
        date: "2023-05-01",
        method: "Bank Transfer",
        reference: "TRF12345",
        notes: "50% upfront payment",
      },
      {
        id: "pay2",
        invoiceId: "inv2",
        projectId: "p2",
        amount: 3000,
        date: "2023-05-15",
        method: "Credit Card",
        reference: "CC98765",
        notes: "Final payment",
      },
    ]);
  }, []);

  const onSubmit = (values: Payment) => {
    const newPayment = {
      ...values,
      id: `pay${Date.now().toString().slice(-4)}`,
    };
    setPayments(prev => [...prev, newPayment]);
    setOpen(false);
    form.reset();
    toast({
      title: "Payment Recorded",
      description: `Payment of ${currencySymbol}${values.amount} has been recorded.`,
    });
  };

  const handleDelete = (payment: Payment) => {
    addDeletedItem(
      'payment', 
      payment.id!, 
      `Payment for ${payment.amount}`, 
      payment
    );
    setPayments(prev => prev.filter(p => p.id !== payment.id));
    toast({
      title: "Payment Deleted",
      description: `Payment has been moved to trash.`,
    });
  };

  // Get invoice details for a payment
  const getInvoiceDetails = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    return invoice || { customer: "Unknown", project: "Unknown", total: 0 };
  };

  // Get project name for a payment
  const getProjectName = (projectId: string) => {
    const project = projects.find(proj => proj.id === projectId);
    return project?.name || "Unknown Project";
  };

  const getInvoicesForProject = (projectId: string) => {
    return invoices.filter(inv => inv.project === projectId);
  };

  // Watch for project change to update invoice dropdown
  const watchedProjectId = form.watch("projectId");

  return (
    <PageContainer>
      <PageHeader
        title="Payment Management"
        description="Track and manage all payments"
        action={{
          label: "Record Payment",
          onClick: () => setOpen(true),
        }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record New Payment</DialogTitle>
            <DialogDescription>
              Enter the details of the payment received.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Clear invoice selection when project changes
                        form.setValue("invoiceId", "");
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name} - {project.client}
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
                name="invoiceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!watchedProjectId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={watchedProjectId ? "Select invoice" : "Select a project first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {watchedProjectId && getInvoicesForProject(watchedProjectId).map(invoice => (
                          <SelectItem key={invoice.id} value={invoice.id}>
                            {invoice.id} - ${invoice.total}
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Payment amount"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map(method => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Transaction reference" {...field} />
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
                      <Input placeholder="Additional information" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Record Payment</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currencySymbol}{payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payments This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currencySymbol}{payments.filter(p => {
                const paymentDate = new Date(p.date);
                const today = new Date();
                return paymentDate.getMonth() === today.getMonth() && 
                      paymentDate.getFullYear() === today.getFullYear();
              }).reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments Recorded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-16 w-16 text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-lg font-medium">No Payments Yet</h3>
            <p className="text-muted-foreground">Record a payment to get started</p>
            <Button className="mt-4" onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Record Payment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const invoiceDetails = getInvoiceDetails(payment.invoiceId);
                return (
                  <TableRow key={payment.id}>
                    <TableCell>{format(new Date(payment.date), 'PP')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{payment.invoiceId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
                        <span>{getProjectName(payment.projectId)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{currencySymbol}{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.method}</Badge>
                    </TableCell>
                    <TableCell>{payment.reference || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(payment)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
};

export default Payments;
