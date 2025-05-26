
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id?: string;
  number: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchInvoices = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        toast({
          title: "Error",
          description: "Failed to fetch invoices",
          variant: "destructive",
        });
        return;
      }

      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData: Partial<Invoice>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          client_id: invoiceData.client_id,
          number: invoiceData.number,
          issue_date: invoiceData.issue_date,
          due_date: invoiceData.due_date,
          status: invoiceData.status || 'draft',
          subtotal: invoiceData.subtotal || 0,
          tax: invoiceData.tax || 0,
          total: invoiceData.total || 0,
          notes: invoiceData.notes,
          project_id: invoiceData.project_id,
        });

      if (error) {
        console.error('Error creating invoice:', error);
        toast({
          title: "Error",
          description: "Failed to create invoice",
          variant: "destructive",
        });
        return false;
      }

      await fetchInvoices();
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      return true;
    } catch (error) {
      console.error('Error creating invoice:', error);
      return false;
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update(invoiceData)
        .eq('id', id);

      if (error) {
        console.error('Error updating invoice:', error);
        toast({
          title: "Error",
          description: "Failed to update invoice",
          variant: "destructive",
        });
        return false;
      }

      await fetchInvoices();
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating invoice:', error);
      return false;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting invoice:', error);
        toast({
          title: "Error",
          description: "Failed to delete invoice",
          variant: "destructive",
        });
        return false;
      }

      await fetchInvoices();
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  return {
    invoices,
    loading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    refetch: fetchInvoices,
  };
};
