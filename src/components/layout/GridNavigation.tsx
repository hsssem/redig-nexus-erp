
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, Users, BriefcaseBusiness, Calendar, FileText, 
  Settings, PieChart, UserCircle, CheckSquare,
  Trash2, DollarSign, UserPlus, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LanguageSelector from '@/components/language/LanguageSelector';
import TranslatedText from '@/components/language/TranslatedText';

interface GridNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const GridNavItem: React.FC<GridNavItemProps> = ({ to, icon, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg min-h-[120px] group",
        isActive 
          ? "bg-darkyellow-100 border-darkyellow-500 text-darkyellow-800 shadow-md" 
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "transition-colors",
        isActive ? "text-darkyellow-600" : "text-gray-500 group-hover:text-gray-700"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-sm font-medium text-center transition-colors",
        isActive ? "text-darkyellow-800" : "text-gray-700 group-hover:text-gray-900"
      )}>
        <TranslatedText text={label} />
      </span>
    </Link>
  );
};

const GridNavigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Get user display info from Supabase user object
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return displayName.slice(0, 2).toUpperCase();
  };

  const menuItems = [
    { to: "/today", icon: <Home size={32} />, label: "Today Overview" },
    { to: "/", icon: <PieChart size={32} />, label: "Dashboard" },
    { to: "/leads", icon: <UserPlus size={32} />, label: "Leads" },
    { to: "/customers", icon: <Users size={32} />, label: "Customers" },
    { to: "/tasks", icon: <CheckSquare size={32} />, label: "Tasks" },
    { to: "/meetings", icon: <Calendar size={32} />, label: "Meetings" },
    { to: "/invoices", icon: <FileText size={32} />, label: "Invoices" },
    { to: "/payments", icon: <DollarSign size={32} />, label: "Payments" },
    { to: "/projects", icon: <BriefcaseBusiness size={32} />, label: "Projects" },
    { to: "/team", icon: <UserCircle size={32} />, label: "Team" },
    { to: "/trash", icon: <Trash2 size={32} />, label: "Trash" },
    { to: "/settings", icon: <Settings size={32} />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 p-2 rounded-lg">
                <img src="https://redig-apps.com/assets/img/logos/logo_w.png" alt="Redig" className="h-8 w-auto" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  <TranslatedText text="ERP System" />
                </h1>
                <p className="text-sm text-gray-600">
                  <TranslatedText text="Digital Transformation" />
                </p>
              </div>
            </div>

            {/* User Profile and Language */}
            <div className="flex items-center gap-4">
              <LanguageSelector variant="button" />
              
              {user && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-darkyellow-500 text-gray-900 font-semibold text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                      <p className="text-xs text-gray-600">
                        <TranslatedText text="User" />
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={logout}
                    className="text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Navigation */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {menuItems.map((item) => (
            <GridNavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.to)}
            />
          ))}
        </div>
      </div>

      {/* Floating animated shapes for visual appeal */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-12 h-12 bg-darkyellow-400/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-12 w-8 h-8 bg-darkyellow-300/10 rounded-md rotate-45 animate-bounce"></div>
        <div className="absolute bottom-40 left-24 w-16 h-16 bg-darkyellow-500/5 rounded-lg animate-pulse"></div>
        <div className="absolute bottom-20 right-8 w-10 h-10 bg-darkyellow-400/10 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default GridNavigation;
