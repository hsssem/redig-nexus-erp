
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslation = (text: string) => {
  const { translate, currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translateText = async () => {
      console.log('Translation hook triggered:', { text, currentLanguage });
      
      if (currentLanguage === 'en' || !text.trim()) {
        console.log('Using original text (English or empty)');
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      console.log(`Starting translation from EN to ${currentLanguage}:`, text);
      
      try {
        const translated = await translate(text);
        console.log('Translation result:', translated);
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
