import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  Calendar,
  BarChart3,
  MoreHorizontal
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Sidebar from './Sidebar';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
  { icon: PlusCircle, label: 'Create', href: '/create' },
  { icon: Calendar, label: 'Schedule', href: '/scheduler' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      {/* Main Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 z-50 safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full space-y-1',
                  'transition-colors duration-200',
                  isActive 
                    ? 'text-violet-600 dark:text-violet-400' 
                    : 'text-slate-500 dark:text-slate-400'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}

          {/* More Menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full space-y-1',
                  'text-slate-500 dark:text-slate-400'
                )}
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="text-[10px] font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              <Sidebar isCollapsed={false} onToggle={() => {}} isMobile onClose={() => setMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Spacer for content */}
      <div className="h-16" />
    </>
  );
};

export default BottomNav;
