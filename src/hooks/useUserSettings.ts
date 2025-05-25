
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserSettings {
  id?: string;
  currency_symbol: string;
  currency_code: string;
  tax_enabled: boolean;
  tax_rate: number;
  tax_name: string;
}

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    currency_symbol: '$',
    currency_code: 'USD',
    tax_enabled: false,
    tax_rate: 19,
    tax_name: 'VAT'
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load settings from database
  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSettings({
          id: data.id,
          currency_symbol: data.currency_symbol,
          currency_code: data.currency_code,
          tax_enabled: data.tax_enabled,
          tax_rate: data.tax_rate,
          tax_name: data.tax_name
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings to database
  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save settings.",
          variant: "destructive"
        });
        return false;
      }

      const updatedSettings = { ...settings, ...newSettings };

      if (settings.id) {
        // Update existing settings
        const { error } = await supabase
          .from('user_settings')
          .update({
            currency_symbol: updatedSettings.currency_symbol,
            currency_code: updatedSettings.currency_code,
            tax_enabled: updatedSettings.tax_enabled,
            tax_rate: updatedSettings.tax_rate,
            tax_name: updatedSettings.tax_name
          })
          .eq('id', settings.id);

        if (error) {
          console.error('Error updating settings:', error);
          toast({
            title: "Error",
            description: "Failed to save settings.",
            variant: "destructive"
          });
          return false;
        }
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            currency_symbol: updatedSettings.currency_symbol,
            currency_code: updatedSettings.currency_code,
            tax_enabled: updatedSettings.tax_enabled,
            tax_rate: updatedSettings.tax_rate,
            tax_name: updatedSettings.tax_name
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating settings:', error);
          toast({
            title: "Error",
            description: "Failed to save settings.",
            variant: "destructive"
          });
          return false;
        }

        if (data) {
          updatedSettings.id = data.id;
        }
      }

      setSettings(updatedSettings);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    saveSettings,
    reloadSettings: loadSettings
  };
};
