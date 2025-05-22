
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, Users, BriefcaseBusiness, Calendar, FileText, 
  Settings, Menu, X, LogOut, PieChart, UserCircle, CheckSquare 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  className?: string;
}

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
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isOpen) setIsOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </Button>
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-4">
            <Link to="/" className="flex items-center gap-2" onClick={closeSidebar}>
              <div className="bg-primary rounded-md p-1">
                <PieChart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">redigERP</span>
            </Link>
            <Button 
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </Button>
          </div>
          
          {/* Navigation links */}
          <div className="flex-1 overflow-auto py-2 px-4">
            <nav className="flex flex-col gap-1">
              <SidebarItem 
                to="/"
                icon={<Home size={20} />}
                label="Dashboard"
                isActive={isActive("/")}
                onClick={closeSidebar}
              />
              <SidebarItem 
                to="/customers"
                icon={<Users size={20} />}
                label="Customers"
                isActive={isActive("/customers")}
                onClick={closeSidebar}
              />
              <SidebarItem 
                to="/tasks"
                icon={<CheckSquare size={20} />}
                label="Tasks"
                isActive={isActive("/tasks")}
                onClick={closeSidebar}
              />
              <SidebarItem 
                to="/meetings"
                icon={<Calendar size={20} />}
                label="Meetings"
                isActive={isActive("/meetings")}
                onClick={closeSidebar}
              />
              <SidebarItem 
                to="/invoices"
                icon={<FileText size={20} />}
                label="Invoices"
                isActive={isActive("/invoices")}
                onClick={closeSidebar}
              />
              <SidebarItem 
                to="/projects"
                icon={<BriefcaseBusiness size={20} />}
                label="Projects"
                isActive={isActive("/projects")}
                onClick={closeSidebar}
              />
              <SidebarItem 
                to="/team"
                icon={<UserCircle size={20} />}
                label="Team"
                isActive={isActive("/team")}
                onClick={closeSidebar}
              />
              <SidebarItem 
                to="/settings"
                icon={<Settings size={20} />}
                label="Settings"
                isActive={isActive("/settings")}
                onClick={closeSidebar}
              />
            </nav>
          </div>
          
          {/* User profile */}
          {user && (
            <div className="border-t border-sidebar-border p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
                  <p className="text-xs text-sidebar-foreground/60">{user.role}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={logout}
                  className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
