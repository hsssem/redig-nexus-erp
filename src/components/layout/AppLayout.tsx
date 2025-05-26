
import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import GridNavigation from './GridNavigation';
import HorizontalNav from './HorizontalNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Show grid navigation only on home route
  if (location.pathname === '/') {
    return <GridNavigation />;
  }
  
  // Show horizontal navigation for CRUD pages
  const crudPages = ['/customers', '/tasks', '/meetings', '/invoices', '/projects', '/team', '/leads', '/payments', '/analytics', '/settings', '/trash'];
  if (crudPages.includes(location.pathname)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HorizontalNav />
        <main className="pt-16 px-4 py-6">
          {children}
        </main>
      </div>
    );
  }

  // For other routes like /today, show the regular sidebar layout
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
