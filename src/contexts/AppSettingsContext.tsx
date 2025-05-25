
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';

interface TaxConfig {
  enabled: boolean;
  rate: number;
  name: string;
}

interface AppSettingsContextType {
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
  currencyCode: string;
  setCurrencyCode: (code: string) => void;
  taxConfig: TaxConfig;
  setTaxConfig: (config: TaxConfig) => void;
  deletedItems: {
    type: 'customer' | 'task' | 'meeting' | 'invoice' | 'project' | 'team' | 'lead' | 'payment';
    id: string;
    name: string;
    deletedAt: Date;
    data: any;
  }[];
  addDeletedItem: (type: 'customer' | 'task' | 'meeting' | 'invoice' | 'project' | 'team' | 'lead' | 'payment', id: string, name: string, data: any) => void;
  clearTrash: () => void;
  restoreItem: (id: string) => any;
  loading: boolean;
}

const AppSettingsContext = createContext<AppSettingsContextType>({
  currencySymbol: '$',
  setCurrencySymbol: () => {},
  currencyCode: 'USD',
  setCurrencyCode: () => {},
  taxConfig: {
    enabled: false,
    rate: 19,
    name: 'VAT'
  },
  setTaxConfig: () => {},
  deletedItems: [],
  addDeletedItem: () => {},
  clearTrash: () => {},
  restoreItem: () => {},
  loading: true,
});

interface AppSettingsProviderProps {
  children: ReactNode;
}

export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({ children }) => {
  const { settings, loading: dbLoading } = useUserSettings();
  const [loading, setLoading] = useState(true);
  
  // Sync with database settings
  const [currencySymbol, setCurrencySymbol] = useState(settings.currency_symbol);
  const [currencyCode, setCurrencyCode] = useState(settings.currency_code);
  const [taxConfig, setTaxConfig] = useState<TaxConfig>({
    enabled: settings.tax_enabled,
    rate: settings.tax_rate,
    name: settings.tax_name
  });
  
  const [deletedItems, setDeletedItems] = useState<{
    type: 'customer' | 'task' | 'meeting' | 'invoice' | 'project' | 'team' | 'lead' | 'payment';
    id: string;
    name: string;
    deletedAt: Date;
    data: any;
  }[]>([]);

  // Update local state when database settings change
  useEffect(() => {
    if (!dbLoading) {
      setCurrencySymbol(settings.currency_symbol);
      setCurrencyCode(settings.currency_code);
      setTaxConfig({
        enabled: settings.tax_enabled,
        rate: settings.tax_rate,
        name: settings.tax_name
      });
      setLoading(false);
    }
  }, [settings, dbLoading]);
  
  // Add item to trash
  const addDeletedItem = (
    type: 'customer' | 'task' | 'meeting' | 'invoice' | 'project' | 'team' | 'lead' | 'payment', 
    id: string, 
    name: string, 
    data: any
  ) => {
    setDeletedItems(prev => [
      ...prev, 
      { 
        type, 
        id, 
        name, 
        deletedAt: new Date(), 
        data 
      }
    ]);
  };
  
  // Clear all items from trash
  const clearTrash = () => {
    setDeletedItems([]);
  };
  
  // Restore item from trash and return its data
  const restoreItem = (id: string) => {
    const item = deletedItems.find(item => item.id === id);
    if (item) {
      setDeletedItems(prev => prev.filter(i => i.id !== id));
      return item.data;
    }
    return null;
  };

  return (
    <AppSettingsContext.Provider value={{
      currencySymbol,
      setCurrencySymbol,
      currencyCode,
      setCurrencyCode,
      taxConfig,
      setTaxConfig,
      deletedItems,
      addDeletedItem,
      clearTrash,
      restoreItem,
      loading,
    }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);
