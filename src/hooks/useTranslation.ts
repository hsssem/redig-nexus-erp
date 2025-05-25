
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslation = (text: string) => {
  const { translate, currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translateText = async () => {
      if (currentLanguage === 'en') {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await translate(text);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(text);
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [text, currentLanguage, translate]);

  return { translatedText, isLoading };
};
