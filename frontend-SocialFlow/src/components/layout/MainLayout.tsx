import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MainLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header 
          onMenuToggle={() => setMobileMenuOpen(true)} 
          isMobile 
        />
        <main className="pb-20">
          <Outlet />
        </main>
        <BottomNav />

        {/* Mobile Menu Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <Sidebar 
              isCollapsed={false} 
              onToggle={() => {}} 
              isMobile 
              onClose={() => setMobileMenuOpen(false)} 
            />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Tablet Layout - Collapsible Sidebar
  if (isTablet) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <Sidebar isCollapsed={false} onToggle={() => {}} isMobile />
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col ml-0">
          <Header />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // Desktop Layout - Fixed Sidebar
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      )}>
        <Header />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
