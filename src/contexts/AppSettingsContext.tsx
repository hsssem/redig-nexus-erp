
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppSettingsContextType {
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
  currencyCode: string;
  setCurrencyCode: (code: string) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType>({
  currencySymbol: '$',
  setCurrencySymbol: () => {},
  currencyCode: 'USD',
  setCurrencyCode: () => {},
});

interface AppSettingsProviderProps {
  children: ReactNode;
}

export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({ children }) => {
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [currencyCode, setCurrencyCode] = useState('USD');

  return (
    <AppSettingsContext.Provider value={{
      currencySymbol,
      setCurrencySymbol,
      currencyCode,
      setCurrencyCode,
    }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);
