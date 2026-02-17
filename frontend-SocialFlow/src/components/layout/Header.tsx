import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Bell,
  Search,
  Menu,
  Plus,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

const getPageTitle = (pathname: string): string => {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/create': 'Create Post',
    '/scheduler': 'Content Calendar',
    '/analytics': 'Analytics',
    '/accounts': 'Connected Accounts',
    '/media': 'Media Library',
    '/settings': 'Settings',
    '/help': 'Help & Support'
  };
  return titles[pathname] || 'SocialFlow Pro';
};

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobile }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDark, setIsDark] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    await logout();
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {isMobile && onMenuToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              {pageTitle}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search posts, accounts, media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-slate-100 dark:bg-slate-900 border-0"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Create Button - Desktop */}
          <Button
            className="hidden sm:flex bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>

          {/* Create Button - Mobile */}
          <Button
            size="icon"
            className="sm:hidden bg-gradient-to-r from-violet-600 to-indigo-600"
          >
            <Plus className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:flex"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-auto">
                <div className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded">
                  <p className="text-sm font-medium">Post Published Successfully</p>
                  <p className="text-xs text-slate-500">Your post on Instagram has been published.</p>
                  <p className="text-xs text-slate-400 mt-1">2 minutes ago</p>
                </div>
                <div className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded">
                  <p className="text-sm font-medium">Account Connected</p>
                  <p className="text-xs text-slate-500">Twitter account @username connected successfully.</p>
                  <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-violet-600">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{user?.firstName}</p>
                  <p className="text-xs text-slate-500">{user?.subscription?.plan || 'Free'}</p>
                </div>
                <ChevronDown className="h-4 w-4 hidden sm:block text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
