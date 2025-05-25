
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  translate: (text: string) => Promise<string>;
  translations: Record<string, string>;
  supportedLanguages: { code: string; name: string; flag: string }[];
}

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  translate: async (text: string) => text,
  translations: {},
  supportedLanguages,
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && supportedLanguages.find(lang => lang.code === savedLanguage)) {
      console.log('Loading saved language:', savedLanguage);
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: string) => {
    console.log('Setting language to:', language);
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
    // Clear translations cache when language changes
    setTranslations({});
  };

  // Translation function with better error handling and fallbacks
  const translate = async (text: string): Promise<string> => {
    if (currentLanguage === 'en' || !text.trim()) {
      return text;
    }

    // Check if translation is cached
    const cacheKey = `${text}_${currentLanguage}`;
    if (translations[cacheKey]) {
      console.log('Using cached translation:', translations[cacheKey]);
      return translations[cacheKey];
    }

    console.log(`Translating "${text}" to ${currentLanguage}`);

    try {
      // Try LibreTranslate first
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: currentLanguage,
          format: 'text'
        }),
      });

      console.log('Translation API response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Translation API response data:', data);
      
      const translatedText = data.translatedText || text;

      // Cache the translation
      setTranslations(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }));

      return translatedText;
    } catch (error) {
      console.error('Translation API error:', error);
      
      // Fallback: return some basic translations for common words
      const basicTranslations: Record<string, Record<string, string>> = {
        'es': {
          'Dashboard': 'Panel de Control',
          'Customers': 'Clientes',
          'Projects': 'Proyectos',
          'Tasks': 'Tareas',
          'Settings': 'Configuración',
          'Meetings': 'Reuniones',
          'Invoices': 'Facturas',
          'Payments': 'Pagos',
          'Team': 'Equipo',
          'Today Overview': 'Resumen de Hoy',
          'Leads': 'Prospectos',
          'Trash': 'Papelera',
          'ERP System': 'Sistema ERP',
          'Digital Transformation': 'Transformación Digital'
        },
        'fr': {
          'Dashboard': 'Tableau de Bord',
          'Customers': 'Clients',
          'Projects': 'Projets',
          'Tasks': 'Tâches',
          'Settings': 'Paramètres',
          'Meetings': 'Réunions',
          'Invoices': 'Factures',
          'Payments': 'Paiements',
          'Team': 'Équipe',
          'Today Overview': 'Aperçu du Jour',
          'Leads': 'Prospects',
          'Trash': 'Corbeille',
          'ERP System': 'Système ERP',
          'Digital Transformation': 'Transformation Numérique'
        }
      };

      const fallbackTranslation = basicTranslations[currentLanguage]?.[text];
      if (fallbackTranslation) {
        console.log('Using fallback translation:', fallbackTranslation);
        // Cache the fallback translation
        setTranslations(prev => ({
          ...prev,
          [cacheKey]: fallbackTranslation
        }));
        return fallbackTranslation;
      }

      // If no fallback available, return original text
      return text;
    }
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      translate,
      translations,
      supportedLanguages,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
