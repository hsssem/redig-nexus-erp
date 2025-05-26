
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Payment {
  id: string;
  user_id: string;
  invoice_id?: string;
  project_id?: string;
  amount: number;
  payment_date: string;
  method: string;
  reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPayments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch payments",
          variant: "destructive",
        });
        return;
      }

      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: Partial<Payment>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          invoice_id: paymentData.invoice_id,
          project_id: paymentData.project_id,
          amount: paymentData.amount || 0,
          payment_date: paymentData.payment_date,
          method: paymentData.method,
          reference: paymentData.reference,
          notes: paymentData.notes,
        });

      if (error) {
        console.error('Error creating payment:', error);
        toast({
          title: "Error",
          description: "Failed to create payment",
          variant: "destructive",
        });
        return false;
      }

      await fetchPayments();
      toast({
        title: "Success",
        description: "Payment created successfully",
      });
      return true;
    } catch (error) {
      console.error('Error creating payment:', error);
      return false;
    }
  };

  const updatePayment = async (id: string, paymentData: Partial<Payment>) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update(paymentData)
        .eq('id', id);

      if (error) {
        console.error('Error updating payment:', error);
        toast({
          title: "Error",
          description: "Failed to update payment",
          variant: "destructive",
        });
        return false;
      }

      await fetchPayments();
      toast({
        title: "Success",
        description: "Payment updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating payment:', error);
      return false;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting payment:', error);
        toast({
          title: "Error",
          description: "Failed to delete payment",
          variant: "destructive",
        });
        return false;
      }

      await fetchPayments();
      toast({
        title: "Success",
        description: "Payment deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting payment:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  return {
    payments,
    loading,
    createPayment,
    updatePayment,
    deletePayment,
    refetch: fetchPayments,
  };
};
