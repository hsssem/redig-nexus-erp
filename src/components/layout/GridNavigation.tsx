
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
import TodayOverviewWidget from './TodayOverviewWidget';

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
        "group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:scale-105 min-h-[140px]",
        "bg-gradient-to-br from-white via-white to-gray-50",
        "border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
        "hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:border-darkyellow-300/50",
        "transform-gpu perspective-1000",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-darkyellow-400/5 before:to-darkyellow-600/5 before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100",
        isActive && "ring-2 ring-darkyellow-500/30 bg-gradient-to-br from-darkyellow-50 to-darkyellow-100/50 shadow-[0_8px_30px_rgba(255,193,7,0.15)]"
      )}
      onClick={onClick}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className={cn(
        "relative z-10 transition-all duration-300 transform-gpu",
        "group-hover:scale-110 group-hover:-translate-y-1",
        isActive ? "text-darkyellow-600 scale-110" : "text-gray-600 group-hover:text-darkyellow-600"
      )}>
        {icon}
      </div>
      <span className={cn(
        "relative z-10 text-sm font-semibold text-center transition-all duration-300",
        "group-hover:-translate-y-1 group-hover:scale-105",
        isActive ? "text-darkyellow-800" : "text-gray-700 group-hover:text-darkyellow-800"
      )}>
        <TranslatedText text={label} />
      </span>
      
      {/* 3D depth effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
};

const GridNavigation: React.FC = () => {
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
    { to: "/today", icon: <Home size={36} />, label: "Today Overview" },
    { to: "/dashboard", icon: <PieChart size={36} />, label: "Dashboard" },
    { to: "/leads", icon: <UserPlus size={36} />, label: "Leads" },
    { to: "/customers", icon: <Users size={36} />, label: "Customers" },
    { to: "/tasks", icon: <CheckSquare size={36} />, label: "Tasks" },
    { to: "/meetings", icon: <Calendar size={36} />, label: "Meetings" },
    { to: "/invoices", icon: <FileText size={36} />, label: "Invoices" },
    { to: "/payments", icon: <DollarSign size={36} />, label: "Payments" },
    { to: "/projects", icon: <BriefcaseBusiness size={36} />, label: "Projects" },
    { to: "/team", icon: <UserCircle size={36} />, label: "Team" },
    { to: "/analytics", icon: <PieChart size={36} />, label: "Analytics" },
    { to: "/trash", icon: <Trash2 size={36} />, label: "Trash" },
    { to: "/settings", icon: <Settings size={36} />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-darkyellow-400/10 to-darkyellow-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-darkblue-400/10 to-darkblue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LanguageSelector variant="button" />
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200/50">
                  <Avatar className="h-10 w-10 ring-2 ring-darkyellow-500/30 shadow-lg">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-darkyellow-400 to-darkyellow-600 text-white font-bold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-600 font-medium">
                      <TranslatedText text="Administrator" />
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={logout}
                    className="text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 rounded-full transition-all duration-200"
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Logo Section */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-darkyellow-400 to-darkyellow-600 p-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img src="https://redig-apps.com/assets/img/logos/logo_w.png" alt="Redig" className="h-16 w-auto" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            <TranslatedText text="ERP System" />
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            <TranslatedText text="Digital Transformation Platform" />
          </p>
        </div>

        {/* Today Overview Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
            <Home className="text-darkyellow-500" size={24} />
            <TranslatedText text="Today Overview" />
          </h2>
          <TodayOverviewWidget />
        </div>

        {/* Navigation Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            <TranslatedText text="Quick Access" />
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
      </div>
    </div>
  );
};

export default GridNavigation;
