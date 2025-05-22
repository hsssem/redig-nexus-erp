import React, { useState } from 'react';
import { Search, PlusCircle, Download, Send, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { invoices, Invoice, InvoiceItem } from '@/services/mockData';
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAppSettings } from '@/contexts/AppSettingsContext';

const formSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  notes: z.string().optional(),
  date: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  items: z.array(
    z.object({
      id: z.string(),
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(1, "Quantity is required"),
      unitPrice: z.number().min(0, "Unit price is required"),
      total: z.number()
    })
  ).min(1, "At least one item is required"),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number()
});

type FormValues = z.infer<typeof formSchema>;

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoicesList, setInvoicesList] = useState<Invoice[]>(invoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { currencySymbol } = useAppSettings();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      status: 'draft',
      items: [
        {
          id: '1',
          description: '',
          quantity: 1,
          unitPrice: 0,
          total: 0
        }
      ],
      subtotal: 0,
      tax: 0,
      total: 0,
      notes: ''
    }
  });

  const handleCreateInvoice = (data: FormValues) => {
    // Ensure all required properties are populated
    const newInvoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${invoicesList.length + 1}`.padStart(12, '0'),
      customer: data.customer,
      date: data.date,
      dueDate: data.dueDate,
      status: data.status,
      items: data.items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      })),
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      notes: data.notes
    };
    
    setInvoicesList([...invoicesList, newInvoice]);
    toast.success("Invoice created successfully");
    setIsCreateDialogOpen(false);
  };

  const handleUpdateInvoice = (data: FormValues) => {
    if (selectedInvoice) {
      const updatedList = invoicesList.map(invoice => 
        invoice.id === selectedInvoice.id 
          ? { 
              ...invoice, 
              customer: data.customer,
              date: data.date,
              dueDate: data.dueDate,
              status: data.status,
              items: data.items,
              subtotal: data.subtotal,
              tax: data.tax,
              total: data.total,
              notes: data.notes
            } 
          : invoice
      );
      
      setInvoicesList(updatedList);
      toast.success("Invoice updated successfully");
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteInvoice = (id: string) => {
    const updatedList = invoicesList.filter(invoice => invoice.id !== id);
    setInvoicesList(updatedList);
    toast.success("Invoice deleted successfully");
  };

  const calculateTotals = () => {
    const items = form.getValues('items');
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.1; // 10% tax rate
    const total = subtotal + tax;
    
    form.setValue('subtotal', subtotal);
    form.setValue('tax', tax);
    form.setValue('total', total);
  };

  const updateItemTotal = (index: number) => {
    const items = form.getValues('items');
    const item = items[index];
    const total = item.quantity * item.unitPrice;
    
    form.setValue(`items.${index}.total`, total);
    calculateTotals();
  };

  const addItemRow = () => {
    const items = form.getValues('items');
    form.setValue('items', [
      ...items, 
      {
        id: `${items.length + 1}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }
    ]);
  };

  const removeItemRow = (index: number) => {
    const items = form.getValues('items');
    if (items.length > 1) {
      form.setValue('items', items.filter((_, i) => i !== index));
      calculateTotals();
    } else {
      toast.error("Invoice must have at least one item");
    }
  };

  const getStatusBadge = (status: "draft" | "sent" | "paid" | "overdue") => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Draft</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Sent</Badge>;
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500 hover:bg-red-600">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredInvoices = invoicesList.filter(invoice => 
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openViewDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    form.reset({
      customer: invoice.customer,
      date: invoice.date,
      dueDate: invoice.dueDate,
      status: invoice.status,
      items: invoice.items,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
      notes: invoice.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const printInvoice = (invoice: Invoice) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(18);
    doc.text('Invoice', 14, 22);
    doc.setFontSize(12);
    doc.text(`#${invoice.id}`, 14, 30);
    
    // Add company info
    doc.setFontSize(10);
    doc.text('RediGERP', 150, 22);
    doc.text('123 Business St', 150, 28);
    doc.text('San Francisco, CA 94103', 150, 34);
    doc.text('contact@redigerp.com', 150, 40);
    
    // Add customer info
    doc.setFontSize(12);
    doc.text('Bill To:', 14, 50);
    doc.setFontSize(10);
    doc.text(`${invoice.customer}`, 14, 56);
    
    // Add invoice details
    doc.text(`Date: ${invoice.date}`, 150, 56);
    doc.text(`Due Date: ${invoice.dueDate}`, 150, 62);
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 150, 68);
    
    // Add invoice items
    const tableColumn = ["Description", "Qty", "Unit Price", "Total"];
    const tableRows: any[] = [];
    
    invoice.items.forEach(item => {
      const itemData = [
        item.description,
        item.quantity.toString(),
        `${currencySymbol}${item.unitPrice.toFixed(2)}`,
        `${currencySymbol}${item.total.toFixed(2)}`
      ];
      tableRows.push(itemData);
    });
    
    (doc as any).autoTable({
      startY: 75,
      head: [tableColumn],
      body: tableRows,
    });
    
    // Add totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Subtotal:', 140, finalY);
    doc.text(`${currencySymbol}${invoice.subtotal.toFixed(2)}`, 170, finalY);
    
    doc.text('Tax:', 140, finalY + 6);
    doc.text(`${currencySymbol}${invoice.tax.toFixed(2)}`, 170, finalY + 6);
    
    doc.text('Total:', 140, finalY + 12);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${currencySymbol}${invoice.total.toFixed(2)}`, 170, finalY + 12);
    
    // Add notes if any
    if (invoice.notes) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Notes:', 14, finalY + 20);
      doc.text(invoice.notes, 14, finalY + 26);
    }
    
    doc.save(`invoice-${invoice.id}.pdf`);
    toast.success("Invoice exported as PDF");
  };

  const sendInvoice = (invoice: Invoice) => {
    if (invoice.status === 'draft') {
      const updatedList = invoicesList.map(inv => 
        inv.id === invoice.id ? { ...inv, status: 'sent' as const } : inv
      );
      setInvoicesList(updatedList);
      toast.success("Invoice sent to customer");
    } else {
      toast.info("Invoice already sent to customer");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <PageContainer className="flex-1">
        <PageHeader
          title="Invoices"
          description="Manage your customer invoices"
        />

        <Card className="shadow-md backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>
                      Add a new invoice for your client
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateInvoice)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="customer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select customer" />
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
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="sent">Sent</SelectItem>
                                  <SelectItem value="paid">Paid</SelectItem>
                                  <SelectItem value="overdue">Overdue</SelectItem>
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
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Invoice Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="font-medium mb-2">Items</div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Description</TableHead>
                              <TableHead className="w-20">Qty</TableHead>
                              <TableHead className="w-32">Unit Price</TableHead>
                              <TableHead className="w-32">Total</TableHead>
                              <TableHead className="w-20"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {form.watch('items')?.map((_, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.description`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input placeholder="Item description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.id`}
                                    render={({ field }) => (
                                      <input type="hidden" {...field} />
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.quantity`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            min="1" 
                                            className="w-20"
                                            {...field}
                                            onChange={(e) => {
                                              field.onChange(Number(e.target.value));
                                              updateItemTotal(index);
                                            }}
                                            value={field.value} 
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.unitPrice`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <div className="relative">
                                            <span className="absolute left-3 top-2.5">
                                              {currencySymbol}
                                            </span>
                                            <Input 
                                              type="number" 
                                              min="0" 
                                              step="0.01" 
                                              className="pl-7"
                                              {...field}
                                              onChange={(e) => {
                                                field.onChange(Number(e.target.value));
                                                updateItemTotal(index);
                                              }}
                                              value={field.value} 
                                            />
                                          </div>
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.total`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <div className="relative">
                                            <span className="absolute left-3 top-2.5">
                                              {currencySymbol}
                                            </span>
                                            <Input 
                                              type="number" 
                                              disabled 
                                              className="pl-7"
                                              value={field.value} 
                                            />
                                          </div>
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500"
                                    onClick={() => removeItemRow(index)}
                                  >
                                    &times;
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={addItemRow}
                        >
                          Add Item
                        </Button>
                        
                        <div className="mt-4 flex flex-col items-end">
                          <div className="grid grid-cols-2 gap-2 w-48">
                            <div className="text-right">Subtotal:</div>
                            <div className="text-right">
                              {currencySymbol}{form.watch('subtotal').toFixed(2)}
                            </div>
                            <div className="text-right">Tax (10%):</div>
                            <div className="text-right">
                              {currencySymbol}{form.watch('tax').toFixed(2)}
                            </div>
                            <div className="text-right font-bold">Total:</div>
                            <div className="text-right font-bold">
                              {currencySymbol}{form.watch('total').toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Input placeholder="Optional notes for the invoice" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit" className="bg-gradient-primary">Create Invoice</Button>
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
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          {currencySymbol}{invoice.total.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => openViewDialog(invoice)}>
                              View
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(invoice)}>
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteInvoice(invoice.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* View Invoice Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            {selectedInvoice && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-xl font-bold">Invoice #{selectedInvoice.id}</DialogTitle>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => printInvoice(selectedInvoice)}
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                      {selectedInvoice.status === 'draft' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => sendInvoice(selectedInvoice)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => printInvoice(selectedInvoice)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                  <DialogDescription className="flex justify-between items-center">
                    <div>
                      {getStatusBadge(selectedInvoice.status)}
                    </div>
                    <div className="text-sm">
                      Created: {selectedInvoice.date} | Due: {selectedInvoice.dueDate}
                    </div>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">From</h3>
                      <div className="mt-1">
                        <p className="font-medium">RediGERP</p>
                        <p className="text-sm">123 Business St</p>
                        <p className="text-sm">San Francisco, CA 94103</p>
                        <p className="text-sm">contact@redigerp.com</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">To</h3>
                      <div className="mt-1">
                        <p className="font-medium">{selectedInvoice.customer}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-20">Qty</TableHead>
                          <TableHead className="w-32">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedInvoice.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              {currencySymbol}{item.unitPrice.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {currencySymbol}{item.total.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="w-48">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{currencySymbol}{selectedInvoice.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Tax:</span>
                        <span>{currencySymbol}{selectedInvoice.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mt-2 font-bold">
                        <span>Total:</span>
                        <span>{currencySymbol}{selectedInvoice.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedInvoice.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                      <p className="text-sm mt-1">{selectedInvoice.notes}</p>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                  <Button className="bg-gradient-primary" onClick={() => openEditDialog(selectedInvoice)}>
                    Edit Invoice
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Invoice Dialog - Similar to Create Dialog but with pre-filled values */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Edit Invoice</DialogTitle>
              <DialogDescription>
                Update the invoice details
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateInvoice)} className="space-y-4">
                {/* Same form fields as Create Dialog, but pre-filled with selectedInvoice values */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select customer" />
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
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
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
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Invoice Items</h3>
                  {form.watch('items').map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="col-span-5">
                            <FormControl>
                              <Input placeholder="Description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Qty" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(Number(e.target.value));
                                  updateItemTotal(index);
                                }}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Price" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(Number(e.target.value));
                                  updateItemTotal(index);
                                }}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`items.${index}.total`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormControl>
                              <Input disabled type="number" placeholder="Total" {...field} value={field.value} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeItemRow(index)}
                        className="col-span-1"
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addItemRow}
                    className="mt-2"
                  >
                    + Add Item
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Input placeholder="Notes" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4 text-right">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{currencySymbol}{form.watch('subtotal').toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%):</span>
                      <span>{currencySymbol}{form.watch('tax').toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{currencySymbol}{form.watch('total').toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="bg-gradient-primary">Update Invoice</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </div>
  );
};

export default Invoices;
