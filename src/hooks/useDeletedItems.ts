
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DeletedItem } from '@/types/appSettings';

export const useDeletedItems = () => {
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load deleted items from localStorage on component mount
  useEffect(() => {
    const storedItems = localStorage.getItem('deletedItems');
    if (storedItems) {
      try {
        setDeletedItems(JSON.parse(storedItems));
      } catch (error) {
        console.error('Error parsing deleted items from localStorage:', error);
        localStorage.removeItem('deletedItems');
      }
    }
  }, []);

  // Save deleted items to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('deletedItems', JSON.stringify(deletedItems));
  }, [deletedItems]);

  const addToTrash = (item: DeletedItem) => {
    setDeletedItems(prev => [...prev, item]);
    toast({
      title: "Item moved to trash",
      description: `${item.type} "${item.name}" has been moved to trash.`,
    });
  };

  const addDeletedItem = (item: DeletedItem) => {
    addToTrash(item);
  };

  const getTableNameForType = (type: string): string => {
    const tableMap: Record<string, string> = {
      'customer': 'clients',
      'task': 'tasks',
      'meeting': 'meetings',
      'invoice': 'invoices',
      'project': 'projects',
      'team': 'teams',
      'lead': 'leads',
      'payment': 'payments'
    };
    return tableMap[type] || 'clients'; // fallback to clients if type not found
  };

  const restoreItem = async (id: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to restore items",
        variant: "destructive",
      });
      return false;
    }

    const itemToRestore = deletedItems.find(item => item.id === id);
    if (!itemToRestore) {
      toast({
        title: "Error",
        description: "Item not found in trash",
        variant: "destructive",
      });
      return false;
    }

    try {
      const tableName = getTableNameForType(itemToRestore.type);
      const { data: itemData } = itemToRestore;

      // Prepare the data for restoration, ensuring user_id is set
      const restoreData = {
        ...itemData,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Remove fields that shouldn't be included in the insert
      delete restoreData.id; // Let database generate new ID

      console.log(`Restoring ${itemToRestore.type} to table ${tableName}:`, restoreData);

      const { error } = await supabase
        .from(tableName as any)
        .insert(restoreData);

      if (error) {
        console.error(`Error restoring ${itemToRestore.type}:`, error);
        toast({
          title: "Error",
          description: `Failed to restore ${itemToRestore.type}`,
          variant: "destructive",
        });
        return false;
      }

      // Remove from trash after successful restoration
      setDeletedItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Item Restored",
        description: `${itemToRestore.type} "${itemToRestore.name}" has been restored successfully.`,
      });

      return true;
    } catch (error) {
      console.error(`Error restoring ${itemToRestore.type}:`, error);
      toast({
        title: "Error",
        description: `Failed to restore ${itemToRestore.type}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const clearTrash = () => {
    setDeletedItems([]);
  };

  const permanentlyDelete = (id: string) => {
    setDeletedItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item permanently deleted",
      description: "The item has been permanently deleted and cannot be recovered.",
      variant: "destructive",
    });
  };

  return {
    deletedItems,
    addToTrash,
    addDeletedItem,
    restoreItem,
    clearTrash,
    permanentlyDelete,
  };
};
