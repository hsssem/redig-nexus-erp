
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MobileMenu from './MobileMenu';
import LanguageSelector from '@/components/language/LanguageSelector';
import TranslatedText from '@/components/language/TranslatedText';

interface SidebarItemProps {
  to: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      className={cn(
        "block px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-2",
        isActive 
          ? "bg-darkyellow-100 text-darkyellow-800 border-l-4 border-darkyellow-500" 
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      )}
      onClick={onClick}
    >
      <TranslatedText text={label} />
    </Link>
  );
};

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  console.log('Sidebar component rendering');
  
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return displayName.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile menu - Only render on mobile */}
      <MobileMenu />
      
      {/* Desktop sidebar - Single instance only */}
      <div 
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg",
          className
        )}
      >
        <div className="flex h-full flex-col w-full">
          {/* Sidebar header */}
          <div className="flex items-center px-6 py-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                <TranslatedText text="ERP System" />
              </h2>
              <p className="text-sm text-gray-600">
                <TranslatedText text="Business Platform" />
              </p>
            </div>
          </div>
          
          {/* Language selector */}
          <div className="px-4 py-3 border-b border-gray-200">
            <LanguageSelector variant="button" />
          </div>
          
          {/* Navigation links */}
          <div className="flex-1 overflow-auto py-6">
            <nav className="space-y-1">
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <TranslatedText text="Main Menu" />
                </h3>
              </div>
              
              <SidebarItem 
                to="/"
                label="Home"
                isActive={isActive("/")}
              />
              <SidebarItem 
                to="/today"
                label="Today Overview"
                isActive={isActive("/today")}
              />
              <SidebarItem 
                to="/dashboard"
                label="Dashboard"
                isActive={isActive("/dashboard")}
              />
              
              <div className="px-4 py-2 mt-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <TranslatedText text="Business" />
                </h3>
              </div>
              
              <SidebarItem 
                to="/leads"
                label="Leads"
                isActive={isActive("/leads")}
              />
              <SidebarItem 
                to="/customers"
                label="Customers"
                isActive={isActive("/customers")}
              />
              <SidebarItem 
                to="/projects"
                label="Projects"
                isActive={isActive("/projects")}
              />
              <SidebarItem 
                to="/invoices"
                label="Invoices"
                isActive={isActive("/invoices")}
              />
              <SidebarItem 
                to="/payments"
                label="Payments"
                isActive={isActive("/payments")}
              />
              
              <div className="px-4 py-2 mt-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <TranslatedText text="Operations" />
                </h3>
              </div>
              
              <SidebarItem 
                to="/tasks"
                label="Tasks"
                isActive={isActive("/tasks")}
              />
              <SidebarItem 
                to="/meetings"
                label="Meetings"
                isActive={isActive("/meetings")}
              />
              <SidebarItem 
                to="/team"
                label="Team"
                isActive={isActive("/team")}
              />
              <SidebarItem 
                to="/analytics"
                label="Analytics"
                isActive={isActive("/analytics")}
              />
              
              <div className="px-4 py-2 mt-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <TranslatedText text="System" />
                </h3>
              </div>
              
              <SidebarItem 
                to="/trash"
                label="Trash"
                isActive={isActive("/trash")}
              />
              <SidebarItem 
                to="/settings"
                label="Settings"
                isActive={isActive("/settings")}
              />
            </nav>
          </div>
          
          {/* User profile */}
          {user && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-darkyellow-500 text-gray-900 font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-600">
                    <TranslatedText text="Administrator" />
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={logout}
                  className="text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                >
                  <TranslatedText text="Logout" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
