
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import LanguageSelector from '@/components/language/LanguageSelector';
import TranslatedText from '@/components/language/TranslatedText';

interface MobileMenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ to, icon, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all",
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

const MobileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { to: "/today", icon: <Home size={20} />, label: "Today Overview" },
    { to: "/", icon: <PieChart size={20} />, label: "Dashboard" },
    { to: "/leads", icon: <UserPlus size={20} />, label: "Leads" },
    { to: "/customers", icon: <Users size={20} />, label: "Customers" },
    { to: "/tasks", icon: <CheckSquare size={20} />, label: "Tasks" },
    { to: "/meetings", icon: <Calendar size={20} />, label: "Meetings" },
    { to: "/invoices", icon: <FileText size={20} />, label: "Invoices" },
    { to: "/payments", icon: <DollarSign size={20} />, label: "Payments" },
    { to: "/projects", icon: <BriefcaseBusiness size={20} />, label: "Projects" },
    { to: "/team", icon: <UserCircle size={20} />, label: "Team" },
    { to: "/trash", icon: <Trash2 size={20} />, label: "Trash" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  // Get user display info from Supabase user object
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return displayName.slice(0, 2).toUpperCase();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm shadow-md hover:bg-white"
        >
          <Menu size={24} className="text-gray-700" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 p-0 bg-white">
        <SheetHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img 
              src="https://redig-apps.com/assets/img/logos/logo_w.png" 
              alt="Redig" 
              className="h-8 w-auto" 
            />
            <div>
              <SheetTitle className="text-left text-gray-800">
                <TranslatedText text="ERP System" />
              </SheetTitle>
              <SheetDescription className="text-left text-gray-600">
                <TranslatedText text="Digital Transformation" />
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Language selector */}
          <div className="px-6 py-3 border-b border-gray-200">
            <LanguageSelector variant="compact" />
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 overflow-auto py-4">
            <div className="space-y-1 px-4">
              {menuItems.map((item) => (
                <MobileMenuItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive(item.to)}
                  onClick={closeMenu}
                />
              ))}
            </div>
          </nav>
          
          {/* User Profile */}
          {user && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-darkyellow-500 text-gray-900 font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-600">
                    <TranslatedText text="User" />
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={logout}
                className="w-full justify-start gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={16} />
                <TranslatedText text="Sign Out" />
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
