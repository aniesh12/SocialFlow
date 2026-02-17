import React, { useState, useEffect } from 'react';
import { accountsAPI } from '@/services/api';
import type { SocialAccount } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/utils/formatters';
import {
  Plus,
  RefreshCw,
  Unlink,
  Trash2,
  Settings,
  Check,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const platformIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube
};

const platformColors: Record<string, string> = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  youtube: '#FF0000'
};

const platformBgColors: Record<string, string> = {
  instagram: 'bg-pink-50 dark:bg-pink-900/20',
  facebook: 'bg-blue-50 dark:bg-blue-900/20',
  twitter: 'bg-sky-50 dark:bg-sky-900/20',
  linkedin: 'bg-indigo-50 dark:bg-indigo-900/20',
  youtube: 'bg-red-50 dark:bg-red-900/20'
};

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountsAPI.getAccounts();
      setAccounts(response.data.data.accounts);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      await accountsAPI.disconnectAccount(accountId);
      fetchAccounts();
    } catch (error) {
      console.error('Failed to disconnect account:', error);
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    try {
      await accountsAPI.deleteAccount(accountId);
      fetchAccounts();
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const handleSync = async (accountId: string) => {
    try {
      await accountsAPI.syncAccount(accountId);
      fetchAccounts();
    } catch (error) {
      console.error('Failed to sync account:', error);
    }
  };

  const availablePlatforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
  ];

  const connectedPlatforms = accounts.map(a => a.platform);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Connected Accounts</h2>
          <p className="text-slate-500 mt-1">Manage your social media connections</p>
        </div>
        <Button 
          onClick={() => setShowConnectDialog(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Accounts</p>
            <p className="text-2xl font-bold">{accounts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Active</p>
            <p className="text-2xl font-bold">{accounts.filter(a => a.isConnected).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Followers</p>
            <p className="text-2xl font-bold">{formatNumber(accounts.reduce((sum, a) => sum + a.followersCount, 0))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Platforms</p>
            <p className="text-2xl font-bold">{new Set(accounts.map(a => a.platform)).size}</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No accounts connected</h3>
            <p className="text-slate-500 mb-4">Connect your social media accounts to start posting</p>
            <Button 
              onClick={() => setShowConnectDialog(true)}
              className="bg-gradient-to-r from-violet-600 to-indigo-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => {
            const PlatformIcon = platformIcons[account.platform];
            const isConnected = account.isConnected;

            return (
              <Card key={account._id} className={cn(
                "overflow-hidden transition-all",
                !isConnected && "opacity-75"
              )}>
                <CardContent className="p-0">
                  {/* Header */}
                  <div className={cn(
                    "p-4",
                    platformBgColors[account.platform]
                  )}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm"
                        >
                          {account.profilePicture ? (
                            <img 
                              src={account.profilePicture} 
                              alt={account.name}
                              className="w-full h-full rounded-xl object-cover"
                            />
                          ) : PlatformIcon ? (
                            <PlatformIcon 
                              className="h-6 w-6" 
                              style={{ color: platformColors[account.platform] }}
                            />
                          ) : null}
                        </div>
                        <div>
                          <h3 className="font-semibold">{account.name}</h3>
                          <p className="text-sm text-slate-500">@{account.username}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSync(account._id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedAccount(account); setShowSettings(true); }}>
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDisconnect(account._id)}
                            className="text-amber-600"
                          >
                            <Unlink className="h-4 w-4 mr-2" />
                            Disconnect
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(account._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold">{formatNumber(account.followersCount)}</p>
                        <p className="text-xs text-slate-500">Followers</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{formatNumber(account.followingCount)}</p>
                        <p className="text-xs text-slate-500">Following</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{formatNumber(account.postsCount)}</p>
                        <p className="text-xs text-slate-500">Posts</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: isConnected ? '#22c55e' : '#ef4444' }}
                        />
                        <span className="text-sm">
                          {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {account.platform}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Connect Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Account</DialogTitle>
            <DialogDescription>
              Choose a platform to connect
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {availablePlatforms.map((platform) => {
              const isConnected = connectedPlatforms.includes(platform.id as any);
              const Icon = platform.icon;
              
              return (
                <button
                  key={platform.id}
                  disabled={isConnected}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all",
                    isConnected 
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 opacity-75" 
                      : "border-slate-200 dark:border-slate-800 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                  )}
                >
                  <Icon className="h-10 w-10" style={{ color: platform.color }} />
                  <span className="font-medium">{platform.name}</span>
                  {isConnected && (
                    <Badge variant="default" className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Configure posting preferences for {selectedAccount?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-publish</p>
                <p className="text-sm text-slate-500">Automatically publish scheduled posts</p>
              </div>
              <Switch 
                checked={selectedAccount?.settings?.autoPublish || false}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Best time to post</p>
                <p className="text-sm text-slate-500">Optimize posting times</p>
              </div>
              <Switch 
                checked={selectedAccount?.settings?.bestTimeToPost?.enabled || false}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accounts;
