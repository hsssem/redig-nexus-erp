
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  estimated_budget: number;
  percentage: number;
  notes?: string;
  positive_qualities?: string;
  negative_qualities?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLeads = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (leadData: Partial<Lead>) => {
    if (!user || !leadData.name || !leadData.email || !leadData.source) return false;

    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          user_id: user.id,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          source: leadData.source,
          estimated_budget: leadData.estimated_budget || 0,
          percentage: leadData.percentage || 10,
          notes: leadData.notes,
          positive_qualities: leadData.positive_qualities,
          negative_qualities: leadData.negative_qualities,
        });

      if (error) {
        console.error('Error creating lead:', error);
        toast({
          title: "Error",
          description: "Failed to create lead",
          variant: "destructive",
        });
        return false;
      }

      await fetchLeads();
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
      return true;
    } catch (error) {
      console.error('Error creating lead:', error);
      return false;
    }
  };

  const updateLead = async (id: string, leadData: Partial<Lead>) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', id);

      if (error) {
        console.error('Error updating lead:', error);
        toast({
          title: "Error",
          description: "Failed to update lead",
          variant: "destructive",
        });
        return false;
      }

      await fetchLeads();
      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating lead:', error);
      return false;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting lead:', error);
        toast({
          title: "Error",
          description: "Failed to delete lead",
          variant: "destructive",
        });
        return false;
      }

      await fetchLeads();
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      return false;
    }
  };

  const convertToClient = async (lead: Lead) => {
    try {
      // Create client from lead
      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: user?.id,
          company_name: lead.name,
          manager: lead.name,
          notes: lead.notes,
          classification: 'Customer',
        });

      if (clientError) {
        console.error('Error converting lead to client:', clientError);
        toast({
          title: "Error",
          description: "Failed to convert lead to client",
          variant: "destructive",
        });
        return false;
      }

      // Delete the lead
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', lead.id);

      if (deleteError) {
        console.error('Error deleting lead after conversion:', deleteError);
        toast({
          title: "Error",
          description: "Failed to remove lead after conversion",
          variant: "destructive",
        });
        return false;
      }

      await fetchLeads();
      toast({
        title: "Success",
        description: "Lead converted to client successfully",
      });
      return true;
    } catch (error) {
      console.error('Error converting lead:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user]);

  return {
    leads,
    loading,
    createLead,
    updateLead,
    deleteLead,
    convertToClient,
    refetch: fetchLeads,
  };
};
