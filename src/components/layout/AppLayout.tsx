
import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import GridNavigation from './GridNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  console.log('AppLayout rendering for route:', location.pathname);
  
  // Show ONLY grid navigation on home route - no other layout
  if (location.pathname === '/') {
    console.log('Rendering GridNavigation only');
    return <GridNavigation />;
  }
  
  // For all other routes, show ONLY sidebar layout - no grid navigation
  console.log('Rendering Sidebar layout for route:', location.pathname);
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
