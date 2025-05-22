
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
  return (
    <div className={`container mx-auto p-4 lg:p-6 relative ${className || ''}`}>
      {/* Enhanced futuristic gradient background effects */}
      <div className="absolute top-0 right-0 w-1/3 h-64 bg-gradient-to-br from-darkblue-700 to-darkblue-400 opacity-10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-10 w-1/4 h-48 bg-gradient-to-tr from-amber-600 to-amber-400 opacity-10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 left-1/5 w-1/4 h-40 bg-purple-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl -z-10" />
      
      {/* Animated subtle pulse effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] -z-10"></div>
      
      {/* Glass morphism effect for the entire container */}
      <div className="relative z-0 backdrop-blur-[3px]">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
