import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { invoices } from '@/services/mockData';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PublicInvoiceViewProps {
  invoiceId?: string;
}

const PublicInvoiceView: React.FC<PublicInvoiceViewProps> = ({ invoiceId }) => {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { currencySymbol, taxConfig } = useAppSettings();

  useEffect(() => {
    // In a real app, fetch from API
    const foundInvoice = invoices.find(inv => inv.id === invoiceId);
    if (foundInvoice) {
      setInvoice(foundInvoice);
    }
    setLoading(false);
  }, [invoiceId]);

  const handleDownload = () => {
    if (!invoice) return;
    
    const doc = new jsPDF();
    
    // Add company logo and info
    doc.setFontSize(20);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    // Add invoice details
    doc.setFontSize(10);
    doc.text('Invoice Number:', 140, 40);
    doc.text(invoice.id, 180, 40, { align: 'right' });
    doc.text('Date:', 140, 45);
    doc.text(format(new Date(invoice.date), 'PP'), 180, 45, { align: 'right' });
    doc.text('Due Date:', 140, 50);
    doc.text(format(new Date(invoice.dueDate), 'PP'), 180, 50, { align: 'right' });
    
    // From (Your company)
    doc.text('From:', 20, 40);
    doc.text('Your Company Name', 20, 45);
    doc.text('123 Business Street', 20, 50);
    doc.text('City, Country', 20, 55);
    doc.text('Email: contact@example.com', 20, 60);
    doc.text('Phone: +1 234 567 890', 20, 65);
    
    // To (Client)
    doc.text('Bill To:', 20, 80);
    doc.text(invoice.customer, 20, 85);
    doc.text('Project: ' + invoice.project, 20, 90);
    
    // Items table
    autoTable(doc, {
      startY: 100,
      head: [['Description', 'Quantity', 'Unit Price', 'Total']],
      body: invoice.items.map((item: any) => [
        item.description,
        item.quantity,
        `${currencySymbol}${item.unitPrice.toFixed(2)}`,
        `${currencySymbol}${item.total.toFixed(2)}`
      ]),
      foot: [
        ['Subtotal', '', '', `${currencySymbol}${invoice.subtotal.toFixed(2)}`],
        [`${taxConfig.name || 'Tax'} (${taxConfig.rate || 0}%)`, '', '', `${currencySymbol}${invoice.tax.toFixed(2)}`],
        ['Total', '', '', `${currencySymbol}${invoice.total.toFixed(2)}`]
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185],
      },
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      }
    });
    
    // Add notes
    if (invoice.notes) {
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text('Notes:', 20, finalY);
      doc.text(invoice.notes, 20, finalY + 5);
    }
    
    // Add payment information
    const paymentY = (doc as any).lastAutoTable.finalY + 20;
    doc.text('Payment Information:', 20, paymentY);
    doc.text('Bank: Example Bank', 20, paymentY + 5);
    doc.text('Account: 123456789', 20, paymentY + 10);
    doc.text('Reference: ' + invoice.id, 20, paymentY + 15);
    
    // Save the PDF
    doc.save(`Invoice-${invoice.id}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <p>Loading invoice...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!invoice) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <p>Invoice not found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto print:shadow-none" id="invoice-to-print">
      <CardHeader className="flex flex-row items-center justify-between print:hidden">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice #{invoice.id}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Company Info & Invoice Details */}
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">INVOICE</h2>
            <div className="text-sm text-muted-foreground">
              <p>Your Company Name</p>
              <p>123 Business Street</p>
              <p>City, Country</p>
              <p>contact@example.com</p>
            </div>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <div className="grid grid-cols-2 gap-x-4 text-sm">
              <p className="text-muted-foreground">Invoice Number:</p>
              <p className="font-medium">{invoice.id}</p>
              <p className="text-muted-foreground">Date:</p>
              <p>{format(new Date(invoice.date), 'PP')}</p>
              <p className="text-muted-foreground">Due Date:</p>
              <p>{format(new Date(invoice.dueDate), 'PP')}</p>
            </div>
          </div>
        </div>
        
        {/* Client Info */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
          <div className="text-sm">
            <p className="font-medium">{invoice.customer}</p>
            <p className="text-muted-foreground">Project: {invoice.project}</p>
          </div>
        </div>
        
        {/* Invoice Items */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Invoice Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted text-muted-foreground text-sm">
                  <th className="text-left p-2">Description</th>
                  <th className="text-right p-2">Quantity</th>
                  <th className="text-right p-2">Unit Price</th>
                  <th className="text-right p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item: any, i: number) => (
                  <tr key={i} className="border-b text-sm">
                    <td className="p-2">{item.description}</td>
                    <td className="text-right p-2">{item.quantity}</td>
                    <td className="text-right p-2">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                    <td className="text-right p-2">{currencySymbol}{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="text-sm">
                  <td colSpan={3} className="text-right p-2 font-medium">Subtotal:</td>
                  <td className="text-right p-2">{currencySymbol}{invoice.subtotal.toFixed(2)}</td>
                </tr>
                <tr className="text-sm">
                  <td colSpan={3} className="text-right p-2 font-medium">{taxConfig.name || 'Tax'} ({taxConfig.rate || 0}%):</td>
                  <td className="text-right p-2">{currencySymbol}{invoice.tax.toFixed(2)}</td>
                </tr>
                <tr className="text-lg font-bold">
                  <td colSpan={3} className="text-right p-2">Total:</td>
                  <td className="text-right p-2">{currencySymbol}{invoice.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* Payment Progress */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Payment Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-5">
            <div 
              className="bg-primary h-5 rounded-full text-xs flex items-center justify-center text-white"
              style={{ width: '50%' }} // This would be calculated based on payments
            >
              50%
            </div>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Paid: {currencySymbol}{(invoice.total * 0.5).toFixed(2)}</span>
            <span>Remaining: {currencySymbol}{(invoice.total * 0.5).toFixed(2)}</span>
          </div>
        </div>
        
        {/* Notes */}
        {invoice.notes && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground">{invoice.notes}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col items-start border-t print:hidden">
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
          <div className="text-sm">
            <p><span className="font-medium">Bank:</span> Example Bank</p>
            <p><span className="font-medium">Account:</span> 123456789</p>
            <p><span className="font-medium">Reference:</span> {invoice.id}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PublicInvoiceView;
