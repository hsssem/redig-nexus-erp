
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Client {
  id: string;
  company_name: string;
  notes?: string;
  manager?: string;
  industry?: string;
  classification?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Error",
          description: "Failed to fetch clients",
          variant: "destructive",
        });
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Partial<Client>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          ...clientData,
        });

      if (error) {
        console.error('Error creating client:', error);
        toast({
          title: "Error",
          description: "Failed to create client",
          variant: "destructive",
        });
        return false;
      }

      await fetchClients();
      toast({
        title: "Success",
        description: "Client created successfully",
      });
      return true;
    } catch (error) {
      console.error('Error creating client:', error);
      return false;
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id);

      if (error) {
        console.error('Error updating client:', error);
        toast({
          title: "Error",
          description: "Failed to update client",
          variant: "destructive",
        });
        return false;
      }

      await fetchClients();
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      return false;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting client:', error);
        toast({
          title: "Error",
          description: "Failed to delete client",
          variant: "destructive",
        });
        return false;
      }

      await fetchClients();
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
};
