
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Meeting {
  id: string;
  user_id: string;
  subject: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  participants: string[];
  status: 'scheduled' | 'completed' | 'canceled';
  notes?: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMeetings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('meeting_date', { ascending: false });

      if (error) {
        console.error('Error fetching meetings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch meetings",
          variant: "destructive",
        });
        return;
      }

      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (meetingData: Partial<Meeting>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('meetings')
        .insert({
          user_id: user.id,
          subject: meetingData.subject,
          meeting_date: meetingData.meeting_date,
          start_time: meetingData.start_time,
          end_time: meetingData.end_time,
          location: meetingData.location,
          participants: meetingData.participants,
          status: meetingData.status || 'scheduled',
          notes: meetingData.notes,
          project_id: meetingData.project_id,
        });

      if (error) {
        console.error('Error creating meeting:', error);
        toast({
          title: "Error",
          description: "Failed to create meeting",
          variant: "destructive",
        });
        return false;
      }

      await fetchMeetings();
      toast({
        title: "Success",
        description: "Meeting created successfully",
      });
      return true;
    } catch (error) {
      console.error('Error creating meeting:', error);
      return false;
    }
  };

  const updateMeeting = async (id: string, meetingData: Partial<Meeting>) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update(meetingData)
        .eq('id', id);

      if (error) {
        console.error('Error updating meeting:', error);
        toast({
          title: "Error",
          description: "Failed to update meeting",
          variant: "destructive",
        });
        return false;
      }

      await fetchMeetings();
      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating meeting:', error);
      return false;
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting meeting:', error);
        toast({
          title: "Error",
          description: "Failed to delete meeting",
          variant: "destructive",
        });
        return false;
      }

      await fetchMeetings();
      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [user]);

  return {
    meetings,
    loading,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    refetch: fetchMeetings,
  };
};
