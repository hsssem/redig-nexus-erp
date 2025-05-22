
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
  return (
    <div className={`container mx-auto p-4 lg:p-6 relative ${className || ''}`}>
      {/* Futuristic gradient background effect */}
      <div className="absolute top-0 right-0 w-1/3 h-64 bg-gradient-primary opacity-5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-10 w-1/4 h-48 bg-gradient-secondary opacity-5 rounded-full blur-3xl -z-10" />
      
      {/* Content container */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
