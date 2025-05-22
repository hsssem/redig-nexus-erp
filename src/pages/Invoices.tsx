import React, { useState } from 'react';
import { ArrowUpDown, Search, PlusCircle, FileText, Printer } from 'lucide-react';
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

const formSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  date: z.string().min(1, "Date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  items: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Unit price must be positive"),
    total: z.number()
  })).min(1, "At least one item is required"),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceList, setInvoiceList] = useState(invoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      status: 'draft',
      items: [{
        id: '1',
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }],
      subtotal: 0,
      tax: 0,
      total: 0,
      notes: ''
    }
  });

  const handleCreateInvoice = (data: FormValues) => {
    const newInvoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${invoiceList.length + 1}`,
      ...data
    };
    
    setInvoiceList([...invoiceList, newInvoice]);
    toast.success("Invoice created successfully");
    setIsCreateDialogOpen(false);
  };

  const handleUpdateInvoice = (data: FormValues) => {
    if (selectedInvoice) {
      const updatedList = invoiceList.map(invoice => 
        invoice.id === selectedInvoice.id ? { ...invoice, ...data } : invoice
      );
      
      setInvoiceList(updatedList);
      toast.success("Invoice updated successfully");
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteInvoice = (id: string) => {
    const updatedList = invoiceList.filter(invoice => invoice.id !== id);
    setInvoiceList(updatedList);
    toast.success("Invoice deleted successfully");
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    toast.info("Preparing invoice for printing...");
    // In a real app, this would generate a PDF or print view
    setTimeout(() => {
      toast.success("Invoice ready for printing");
    }, 1500);
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500 hover:bg-green-600';
      case 'overdue': return 'bg-red-500 hover:bg-red-600';
      case 'sent': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const filteredInvoices = invoiceList.filter(invoice => 
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
      notes: invoice.notes || '',
    });
    setIsEditDialogOpen(true);
  };

  const calculateTotals = () => {
    const items = form.getValues('items');
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // Assuming 10% tax
    const total = subtotal + tax;
    
    form.setValue('subtotal', subtotal);
    form.setValue('tax', tax);
    form.setValue('total', total);
  };

  const updateItemTotal = (index: number) => {
    const items = form.getValues('items');
    const quantity = items[index].quantity;
    const unitPrice = items[index].unitPrice;
    const total = quantity * unitPrice;
    
    items[index].total = total;
    form.setValue('items', items);
    calculateTotals();
  };

  const addItemRow = () => {
    const items = form.getValues('items');
    const newItem: InvoiceItem = {
      id: String(items.length + 1),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    
    form.setValue('items', [...items, newItem]);
  };

  const removeItemRow = (index: number) => {
    const items = form.getValues('items');
    if (items.length > 1) {
      items.splice(index, 1);
      form.setValue('items', items);
      calculateTotals();
    } else {
      toast.error("Invoice must have at least one item");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <PageContainer className="flex-1">
        <PageHeader
          title="Invoices"
          description="Manage your client invoices"
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
                <DialogContent className="sm:max-w-[900px]">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>
                      Fill in the details for the new invoice
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateInvoice)} className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="customer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
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
                                    <Input disabled type="number" placeholder="Total" {...field} />
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
                            <span>${form.watch('subtotal').toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax (10%):</span>
                            <span>${form.watch('tax').toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>${form.watch('total').toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
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
                    <TableHead className="w-[100px]">Invoice #</TableHead>
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
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                          <Badge className={getBadgeColor(invoice.status)}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">${invoice.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openViewDialog(invoice)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(invoice)}>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.33168 11.3754 6.42164 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42161 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42161 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handlePrintInvoice(invoice)}>
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteInvoice(invoice.id)}>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3.5 5C3.22386 5 3 5.22386 3 5.5C3 5.77614 3.22386 6 3.5 6C3.77614 6 4 5.77614 4 5.5C4 5.22386 3.77614 5 3.5 5ZM3.5 7C3.22386 7 3 7.22386 3 7.5C3 7.77614 3.22386 8 3.5 8H11.5C11.7761 8 12 7.77614 12 7.5C12 7.22386 11.7761 7 11.5 7H3.5ZM3 9.5C3 9.22386 3.22386 9 3.5 9C3.77614 9 4 9.22386 4 9.5C4 9.77614 3.77614 10 3.5 10C3.22386 10 3 9.77614 3 9.5ZM3.5 11C3.22386 11 3 11.2239 3 11.5C3 11.7761 3.22386 12 3.5 12H11.5C11.7761 12 12 11.7761 12 11.5C12 11.2239 11.7761 11 11.5 11H3.5ZM3 13.5C3 13.2239 3.22386 13 3.5 13C3.77614 13 4 13.2239 4 13.5C4 13.7761 3.77614 14 3.5 14C3.22386 14 3 13.7761 3 13.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
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
          <DialogContent className="sm:max-w-[900px]">
            {selectedInvoice && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Invoice {selectedInvoice.id}</DialogTitle>
                  <div className="flex items-center justify-between">
                    <DialogDescription>
                      Issue Date: {selectedInvoice.date}
                    </DialogDescription>
                    <Badge className={getBadgeColor(selectedInvoice.status)}>
                      {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                    </Badge>
                  </div>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">From</h3>
                    <div className="font-medium">redigERP Inc.</div>
                    <div>123 Business Street</div>
                    <div>San Francisco, CA 94107</div>
                    <div>United States</div>
                    <div className="mt-1">contact@redigerp.com</div>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">To</h3>
                    <div className="font-medium">{selectedInvoice.customer}</div>
                    {selectedInvoice.customer === 'TechCorp Inc.' && (
                      <>
                        <div>123 Main St</div>
                        <div>San Francisco, CA 94105</div>
                        <div>United States</div>
                        <div className="mt-1">john@techcorp.com</div>
                      </>
                    )}
                    {selectedInvoice.customer === 'Innovate Co' && (
                      <>
                        <div>456 Market St</div>
                        <div>New York, NY 10001</div>
                        <div>United States</div>
                        <div className="mt-1">sarah@innovate.co</div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[400px]">Description</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between mt-6">
                  <div>
                    {selectedInvoice.notes && (
                      <div>
                        <h4 className="font-medium text-muted-foreground mb-1">Notes</h4>
                        <p>{selectedInvoice.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex justify-between gap-8">
                      <span>Subtotal:</span>
                      <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span>Tax:</span>
                      <span>${selectedInvoice.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-8 font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span>${selectedInvoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                  <Button className="bg-gradient-primary" onClick={() => handlePrintInvoice(selectedInvoice)}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Invoice
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Invoice Dialog - Similar to Create Dialog but with pre-filled values */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>Edit Invoice</DialogTitle>
              <DialogDescription>
                Modify the invoice details
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
                
                {/* Rest of the form fields - same as Create Dialog */}
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
                      <span>${form.watch('subtotal').toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%):</span>
                      <span>${form.watch('tax').toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${form.watch('total').toFixed(2)}</span>
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
