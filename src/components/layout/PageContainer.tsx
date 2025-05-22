
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
  return (
    <div className={`container mx-auto p-4 lg:p-6 ${className || ''}`}>
      {children}
    </div>
  );
};

export default PageContainer;
