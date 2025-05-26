
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useTeams = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching team members:', error);
        toast({
          title: "Error",
          description: "Failed to fetch team members",
          variant: "destructive",
        });
        return;
      }

      // Map the data to ensure proper typing
      const typedTeamMembers = (data || []).map(member => ({
        ...member,
        status: member.status as 'active' | 'inactive'
      }));

      setTeamMembers(typedTeamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTeamMember = async (memberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('teams')
        .insert([
          {
            ...memberData,
            user_id: user.id,
          }
        ]);

      if (error) {
        console.error('Error creating team member:', error);
        toast({
          title: "Error",
          description: "Failed to create team member",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Team member created successfully",
      });

      await fetchTeamMembers();
      return true;
    } catch (error) {
      console.error('Error creating team member:', error);
      toast({
        title: "Error",
        description: "Failed to create team member",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateTeamMember = async (id: string, memberData: Partial<TeamMember>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('teams')
        .update(memberData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating team member:', error);
        toast({
          title: "Error",
          description: "Failed to update team member",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Team member updated successfully",
      });

      await fetchTeamMembers();
      return true;
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTeamMember = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting team member:', error);
        toast({
          title: "Error",
          description: "Failed to delete team member",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });

      await fetchTeamMembers();
      return true;
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [user]);

  return {
    teamMembers,
    loading,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    refetch: fetchTeamMembers,
  };
};
