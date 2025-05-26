
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  name: string;
  description?: string;
  project_id?: string;
  duration?: number;
  status?: string;
  assigned_to?: string;
  priority?: string;
  due_date?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error",
          description: "Failed to fetch tasks",
          variant: "destructive",
        });
        return;
      }

      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    if (!user || !taskData.name) return false;

    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          name: taskData.name,
          description: taskData.description,
          project_id: taskData.project_id,
          duration: taskData.duration,
          status: taskData.status,
          assigned_to: taskData.assigned_to,
          priority: taskData.priority,
          due_date: taskData.due_date,
        });

      if (error) {
        console.error('Error creating task:', error);
        toast({
          title: "Error",
          description: "Failed to create task",
          variant: "destructive",
        });
        return false;
      }

      await fetchTasks();
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      return true;
    } catch (error) {
      console.error('Error creating task:', error);
      return false;
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id);

      if (error) {
        console.error('Error updating task:', error);
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive",
        });
        return false;
      }

      await fetchTasks();
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        });
        return false;
      }

      await fetchTasks();
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
};
