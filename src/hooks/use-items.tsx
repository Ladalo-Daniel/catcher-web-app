import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export type ItemStatus = 'safe' | 'stolen' | 'unknown';

export interface Item {
  id: string;
  name: string;
  serial_number: string;
  status: ItemStatus;
  description?: string;
  category?: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  owner?: string;
  contact_info?: string;
  user_id: string;
}

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's items
  const fetchItems = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: "Error",
        description: "Failed to load items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new item
  const addItem = async (itemData: any, user:any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add items",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('items')
        .insert({
          ...itemData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [data, ...prev]);
      
      toast({
        title: "Item Added",
        description: `${itemData.name} has been registered successfully`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Error adding item:', error);
      
      if (error.code === '23505') {
        toast({
          title: "Error",
          description: "An item with this serial number already exists",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add item",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  // Update item
  const updateItem = async (id: string, updates: Partial<Omit<Item, 'id' | 'created_at' | 'user_id'>>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => prev.map(item => item.id === id ? data : item));
      
      return data;
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Delete item
  const deleteItem = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Item Deleted",
        description: "Item has been removed from your registry",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Search items by serial number (only exact matches for security)
  const searchBySerial = async (serialNumber: string) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          id,
          name,
          serial_number,
          status,
          description,
          category,
          created_at,
          updated_at,
          image_url,
          owner,
          contact_info,
          user_id
        `)
        .eq('serial_number', serialNumber);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching items:', error);
      toast({
        title: "Error",
        description: "Failed to search items",
        variant: "destructive",
      });
      return [];
    }
  };

  // Get item by exact serial number
  const getItemBySerial = (serialNumber: string) => {
    return items.find(
      item => item.serial_number.toLowerCase() === serialNumber.toLowerCase()
    );
  };

  // Search user's items
  const searchItems = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.serial_number.toLowerCase().includes(lowercaseQuery) ||
      item.description?.toLowerCase().includes(lowercaseQuery) ||
      item.category?.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Update item status
  const updateItemStatus = async (id: string, status: ItemStatus) => {
    return updateItem(id, { status });
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    fetchItems();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems(prev => [payload.new as Item, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setItems(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as Item : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setItems(prev => prev.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    getItemBySerial,
    searchItems,
    searchBySerial,
    updateItemStatus,
    refetch: fetchItems,
  };
};