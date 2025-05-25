
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, Users, BriefcaseBusiness, Calendar, FileText, 
  Settings, Menu, X, LogOut, PieChart, UserCircle, CheckSquare,
  Trash2, DollarSign, UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MobileMenu from './MobileMenu';
import LanguageSelector from '@/components/language/LanguageSelector';
import TranslatedText from '@/components/language/TranslatedText';

// Animated shapes for digital transformation theme
const FloatingShapes = () => {
  return (
    <>
      <div className="floating-shape left-10 top-20 w-12 h-12 bg-darkyellow-400/20 rounded-full"></div>
      <div className="floating-shape-fast right-12 top-40 w-8 h-8 bg-darkyellow-300/15 rounded-md rotate-45"></div>
      <div className="floating-shape-slow left-24 bottom-40 w-16 h-16 bg-darkyellow-500/10 rounded-lg"></div>
      <div className="floating-shape right-8 bottom-20 w-10 h-10 bg-darkyellow-400/20 rounded-full"></div>
      <div className="floating-shape-fast left-4 bottom-60 w-6 h-6 bg-darkyellow-300/15 rounded-full"></div>
    </>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
        isActive 
          ? "bg-darkyellow-100 text-darkyellow-800 border-l-4 border-darkyellow-500" 
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      )}
      onClick={onClick}
    >
      {icon}
      <TranslatedText text={label} />
    </Link>
  );
};

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile menu */}
      <MobileMenu />
      
      {/* Desktop sidebar */}
      <div 
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg",
          className
        )}
      >
        <div className="flex h-full flex-col relative overflow-hidden">
          {/* Floating animated shapes */}
          <FloatingShapes />
          
          {/* Sidebar header */}
          <div className="flex items-center justify-center px-4 py-6 relative z-10 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <img src="https://redig-apps.com/assets/img/logos/logo_w.png" alt="Redig" className="h-8 w-auto" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  <TranslatedText text="ERP System" />
                </h2>
                <p className="text-xs text-gray-600">
                  <TranslatedText text="Digital Transformation" />
                </p>
              </div>
            </Link>
          </div>
          
          {/* Language selector */}
          <div className="px-4 py-2 border-b border-gray-200 relative z-10">
            <LanguageSelector variant="button" />
          </div>
          
          {/* Navigation links */}
          <div className="flex-1 overflow-auto py-4 px-4 relative z-10">
            <nav className="flex flex-col gap-1">
              <SidebarItem 
                to="/today"
                icon={<Home size={20} />}
                label="Today Overview"
                isActive={isActive("/today")}
              />
              <SidebarItem 
                to="/"
                icon={<PieChart size={20} />}
                label="Dashboard"
                isActive={isActive("/")}
              />
              <SidebarItem 
                to="/leads"
                icon={<UserPlus size={20} />}
                label="Leads"
                isActive={isActive("/leads")}
              />
              <SidebarItem 
                to="/customers"
                icon={<Users size={20} />}
                label="Customers"
                isActive={isActive("/customers")}
              />
              <SidebarItem 
                to="/tasks"
                icon={<CheckSquare size={20} />}
                label="Tasks"
                isActive={isActive("/tasks")}
              />
              <SidebarItem 
                to="/meetings"
                icon={<Calendar size={20} />}
                label="Meetings"
                isActive={isActive("/meetings")}
              />
              <SidebarItem 
                to="/invoices"
                icon={<FileText size={20} />}
                label="Invoices"
                isActive={isActive("/invoices")}
              />
              <SidebarItem 
                to="/payments"
                icon={<DollarSign size={20} />}
                label="Payments"
                isActive={isActive("/payments")}
              />
              <SidebarItem 
                to="/projects"
                icon={<BriefcaseBusiness size={20} />}
                label="Projects"
                isActive={isActive("/projects")}
              />
              <SidebarItem 
                to="/team"
                icon={<UserCircle size={20} />}
                label="Team"
                isActive={isActive("/team")}
              />
              <SidebarItem 
                to="/trash"
                icon={<Trash2 size={20} />}
                label="Trash"
                isActive={isActive("/trash")}
              />
              <SidebarItem 
                to="/settings"
                icon={<Settings size={20} />}
                label="Settings"
                isActive={isActive("/settings")}
              />
            </nav>
          </div>
          
          {/* User profile */}
          {user && (
            <div className="border-t border-gray-200 p-4 relative z-10 bg-gray-50">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-darkyellow-500 text-gray-900 font-semibold">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">
                    <TranslatedText text={user.role} />
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={logout}
                  className="text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                >
                  <LogOut size={18} />
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
