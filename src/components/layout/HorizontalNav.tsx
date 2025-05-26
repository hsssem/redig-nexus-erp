
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, Users, BriefcaseBusiness, Calendar, FileText, 
  Settings, PieChart, UserCircle, CheckSquare,
  Trash2, DollarSign, UserPlus, LogOut, Grid3X3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LanguageSelector from '@/components/language/LanguageSelector';
import TranslatedText from '@/components/language/TranslatedText';

const HorizontalNav: React.FC = () => {
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

  const menuItems = [
    { to: "/", icon: <Grid3X3 size={20} />, label: "Grid Menu" },
    { to: "/today", icon: <Home size={20} />, label: "Today" },
    { to: "/dashboard", icon: <PieChart size={20} />, label: "Dashboard" },
    { to: "/leads", icon: <UserPlus size={20} />, label: "Leads" },
    { to: "/customers", icon: <Users size={20} />, label: "Customers" },
    { to: "/tasks", icon: <CheckSquare size={20} />, label: "Tasks" },
    { to: "/meetings", icon: <Calendar size={20} />, label: "Meetings" },
    { to: "/invoices", icon: <FileText size={20} />, label: "Invoices" },
    { to: "/payments", icon: <DollarSign size={20} />, label: "Payments" },
    { to: "/projects", icon: <BriefcaseBusiness size={20} />, label: "Projects" },
    { to: "/team", icon: <UserCircle size={20} />, label: "Team" },
    { to: "/analytics", icon: <PieChart size={20} />, label: "Analytics" },
    { to: "/trash", icon: <Trash2 size={20} />, label: "Trash" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-darkyellow-400 to-darkyellow-600 p-2 rounded-lg shadow-lg">
              <img src="https://redig-apps.com/assets/img/logos/logo_w.png" alt="Redig" className="h-6 w-auto" />
            </div>
            <span className="font-bold text-gray-800 hidden sm:block">ERP System</span>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-1 bg-gray-100/50 rounded-full p-1 max-w-4xl overflow-x-auto scrollbar-hidden">
              {menuItems.slice(0, 10).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                    isActive(item.to)
                      ? "bg-darkyellow-500 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:bg-white/70 hover:text-gray-900 hover:shadow-md"
                  )}
                >
                  {item.icon}
                  <span className="hidden lg:inline">
                    <TranslatedText text={item.label} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Profile and Actions */}
          <div className="flex items-center gap-3">
            <LanguageSelector variant="button" />
            
            {user && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-darkyellow-500/20">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-darkyellow-500 text-gray-900 font-semibold text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 hidden md:inline">
                  {getUserDisplayName()}
                </span>
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
    </nav>
  );
};

export default HorizontalNav;
