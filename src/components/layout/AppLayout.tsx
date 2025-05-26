
import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import GridNavigation from './GridNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Show grid navigation ONLY on home route
  if (location.pathname === '/') {
    return <GridNavigation />;
  }
  
  // For all other routes, show ONLY the sidebar layout
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
