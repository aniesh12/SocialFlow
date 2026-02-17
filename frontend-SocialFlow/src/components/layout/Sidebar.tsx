import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  PlusCircle,
  Calendar,
  BarChart3,
  Users,
  Image,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: PlusCircle, label: 'Create Post', href: '/create' },
  { icon: Calendar, label: 'Scheduler', href: '/scheduler' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Users, label: 'Accounts', href: '/accounts' },
  { icon: Image, label: 'Media Library', href: '/media' },
];

const bottomNavItems: NavItem[] = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/help' },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, isMobile, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);

    return (
      <NavLink
        to={item.href}
        onClick={isMobile ? onClose : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
          'hover:bg-slate-100 dark:hover:bg-slate-800',
          isActive 
            ? 'bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 text-violet-700 dark:text-violet-300 font-medium' 
            : 'text-slate-600 dark:text-slate-400'
        )}
      >
        <Icon className={cn(
          'h-5 w-5 flex-shrink-0 transition-colors',
          isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
        )} />
        {!isCollapsed && (
          <span className="truncate flex-1">{item.label}</span>
        )}
        {!isCollapsed && item.badge && (
          <span className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-950">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">SocialFlow Pro</h2>
              <p className="text-xs text-slate-500">SMM Platform</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </nav>

          <Separator className="my-4" />

          <nav className="space-y-1">
            {bottomNavItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex flex-col h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-200">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white whitespace-nowrap">SocialFlow</h2>
              <p className="text-xs text-slate-500 whitespace-nowrap">Pro</p>
            </div>
          )}
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 flex-shrink-0"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </nav>

        <Separator className="my-4" />

        <nav className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className={cn(
          'flex items-center gap-3',
          isCollapsed && 'flex-col'
        )}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
              <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          )}
          {!isCollapsed && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isCollapsed && (
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 mt-2 text-slate-500 hover:text-red-600 mx-auto block"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
