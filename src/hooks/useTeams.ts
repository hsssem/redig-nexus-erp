import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTeamMemberData {
  name: string;
  role: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar_url?: string;
}

export const useTeams = () => {
  const [teams, setTeams] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTeams = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teams:', error);
        toast.error('Failed to load team members');
        return;
      }

      // Type the data properly to match our TeamMember interface
      const typedData: TeamMember[] = (data || []).map(item => ({
        ...item,
        status: item.status as 'active' | 'inactive' | 'on-leave',
        phone: item.phone || undefined,
        avatar_url: item.avatar_url || undefined
      }));

      setTeams(typedData);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const createTeamMember = async (data: CreateTeamMemberData): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to create team members');
      return false;
    }

    try {
      const { error } = await supabase
        .from('teams')
        .insert({
          ...data,
          user_id: user.id,
        });

      if (error) {
        console.error('Error creating team member:', error);
        toast.error('Failed to create team member');
        return false;
      }

      toast.success('Team member created successfully');
      await fetchTeams();
      return true;
    } catch (error) {
      console.error('Error creating team member:', error);
      toast.error('Failed to create team member');
      return false;
    }
  };

  const updateTeamMember = async (id: string, data: Partial<CreateTeamMemberData>): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update team members');
      return false;
    }

    try {
      const { error } = await supabase
        .from('teams')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating team member:', error);
        toast.error('Failed to update team member');
        return false;
      }

      toast.success('Team member updated successfully');
      await fetchTeams();
      return true;
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Failed to update team member');
      return false;
    }
  };

  const deleteTeamMember = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to delete team members');
      return false;
    }

    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting team member:', error);
        toast.error('Failed to delete team member');
        return false;
      }

      toast.success('Team member deleted successfully');
      await fetchTeams();
      return true;
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
      return false;
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [user]);

  return {
    teams,
    loading,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    refetch: fetchTeams,
  };
};
