import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '@/services/api';
import type { DashboardStats } from '@/types';
import { formatNumber } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';

const platformIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon, 
    description,
    loading 
  }: { 
    title: string; 
    value: string | number; 
    change?: number; 
    changeType?: 'positive' | 'negative';
    icon: React.ElementType;
    description?: string;
    loading?: boolean;
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <h3 className="text-2xl sm:text-3xl font-bold">{value}</h3>
            )}
            {change !== undefined && !loading && (
              <div className="flex items-center gap-1">
                {changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(change)}%
                </span>
                <span className="text-slate-400 text-sm">vs last period</span>
              </div>
            )}
            {description && <p className="text-xs text-slate-400">{description}</p>}
          </div>
          <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
            <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back! 👋
          </h2>
          <p className="text-slate-500 mt-1">
            Here's what's happening with your social media accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="h-9">
              <TabsTrigger value="24h" className="text-xs">24H</TabsTrigger>
              <TabsTrigger value="7d" className="text-xs">7D</TabsTrigger>
              <TabsTrigger value="30d" className="text-xs">30D</TabsTrigger>
              <TabsTrigger value="90d" className="text-xs">90D</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600">
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Posts"
          value={loading ? '-' : formatNumber(stats?.overview.totalPosts || 0)}
          change={12}
          changeType="positive"
          icon={FileText}
          loading={loading}
        />
        <StatCard
          title="Total Engagement"
          value={loading ? '-' : formatNumber(stats?.overview.totalEngagement || 0)}
          change={8}
          changeType="positive"
          icon={Heart}
          loading={loading}
        />
        <StatCard
          title="Total Reach"
          value={loading ? '-' : formatNumber(stats?.overview.totalReach || 0)}
          change={5}
          changeType="positive"
          icon={Eye}
          loading={loading}
        />
        <StatCard
          title="Connected Accounts"
          value={loading ? '-' : stats?.overview.connectedAccounts || 0}
          icon={Users}
          description="Across all platforms"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Your latest published content</CardDescription>
            </div>
            <Link to="/create">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : stats?.recentPosts && stats.recentPosts.length > 0 ? (
              <div className="space-y-4">
                {stats.recentPosts.slice(0, 5).map((post) => (
                  <div 
                    key={post._id} 
                    className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      {post.media && post.media.length > 0 ? (
                        <img 
                          src={post.media[0].thumbnail || post.media[0].url} 
                          alt="" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FileText className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {post.title || post.content.substring(0, 50)}...
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex -space-x-1">
                          {post.platforms.slice(0, 3).map((platform, idx) => {
                            const PlatformIcon = platformIcons[platform.platform] || FileText;
                            return (
                              <div 
                                key={idx}
                                className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center"
                              >
                                <PlatformIcon className="h-3 w-3" />
                              </div>
                            );
                          })}
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                          {post.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {formatNumber(post.analytics?.totalEngagement || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {formatNumber(post.analytics?.totalReach || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No posts yet</p>
                <Link to="/create">
                  <Button variant="link" className="mt-2">
                    Create your first post
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>Your connected accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : stats?.platformBreakdown && stats.platformBreakdown.length > 0 ? (
              <div className="space-y-4">
                {stats.platformBreakdown.map((platform) => {
                  const PlatformIcon = platformIcons[platform._id] || FileText;
                  return (
                    <div 
                      key={platform._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${getPlatformColor(platform._id)}20` }}
                        >
                          <PlatformIcon 
                            className="h-5 w-5" 
                            style={{ color: getPlatformColor(platform._id) }}
                          />
                        </div>
                        <div>
                          <p className="font-medium capitalize">{platform._id}</p>
                          <p className="text-xs text-slate-500">{platform.count} accounts</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatNumber(platform.followers)}</p>
                        <p className="text-xs text-slate-500">followers</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No accounts connected</p>
                <Link to="/accounts">
                  <Button variant="link" className="mt-2">
                    Connect an account
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/create">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6 text-violet-600" />
              </div>
              <p className="font-medium text-sm">Create Post</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/scheduler">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <p className="font-medium text-sm">Schedule</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/analytics">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-medium text-sm">Analytics</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/accounts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <p className="font-medium text-sm">Accounts</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    instagram: '#E4405F',
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    linkedin: '#0A66C2',
    youtube: '#FF0000'
  };
  return colors[platform] || '#666666';
}

export default Dashboard;
