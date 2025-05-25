
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';

interface TranslatedTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  showSkeleton?: boolean;
  children?: never;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  text, 
  as: Component = 'span', 
  className,
  showSkeleton = false,
  ...props 
}) => {
  const { translatedText, isLoading } = useTranslation(text);

  if (isLoading && showSkeleton) {
    return <Skeleton className={`h-4 w-24 ${className}`} />;
  }

  return (
    <Component className={className} {...props}>
      {translatedText}
    </Component>
  );
};

export default TranslatedText;
