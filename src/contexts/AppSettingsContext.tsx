
import React, { createContext, useContext, ReactNode } from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useDeletedItems } from '@/hooks/useDeletedItems';
import { AppSettingsContextType } from '@/types/appSettings';

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};

interface AppSettingsProviderProps {
  children: ReactNode;
}

export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({ children }) => {
  const { settings, loading: settingsLoading } = useUserSettings();
  const {
    deletedItems,
    addToTrash,
    addDeletedItem,
    restoreItem,
    clearTrash,
    permanentlyDelete,
  } = useDeletedItems();

  const value: AppSettingsContextType = {
    deletedItems,
    addToTrash,
    restoreItem,
    clearTrash,
    permanentlyDelete,
    currencySymbol: settings.currency_symbol,
    taxConfig: {
      enabled: settings.tax_enabled,
      rate: settings.tax_rate,
      name: settings.tax_name,
    },
    loading: settingsLoading,
    addDeletedItem,
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};
