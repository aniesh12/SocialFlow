import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatNumber } from '@/utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  Download
} from 'lucide-react';



const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getAnalytics({ 
        startDate: getStartDate(timeRange),
        endDate: new Date().toISOString()
      });
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (range: string) => {
    const date = new Date();
    switch (range) {
      case '24h':
        date.setDate(date.getDate() - 1);
        break;
      case '7d':
        date.setDate(date.getDate() - 7);
        break;
      case '30d':
        date.setDate(date.getDate() - 30);
        break;
      case '90d':
        date.setDate(date.getDate() - 90);
        break;
    }
    return date.toISOString();
  };

  // Mock data for charts
  const engagementData = [
    { name: 'Mon', engagement: 4000, reach: 2400 },
    { name: 'Tue', engagement: 3000, reach: 1398 },
    { name: 'Wed', engagement: 2000, reach: 9800 },
    { name: 'Thu', engagement: 2780, reach: 3908 },
    { name: 'Fri', engagement: 1890, reach: 4800 },
    { name: 'Sat', engagement: 2390, reach: 3800 },
    { name: 'Sun', engagement: 3490, reach: 4300 },
  ];

  const platformData = [
    { name: 'Instagram', value: 400, color: '#E4405F' },
    { name: 'Facebook', value: 300, color: '#1877F2' },
    { name: 'Twitter', value: 200, color: '#1DA1F2' },
    { name: 'LinkedIn', value: 100, color: '#0A66C2' },
  ];

  const followerGrowthData = [
    { name: 'Week 1', followers: 1000 },
    { name: 'Week 2', followers: 1200 },
    { name: 'Week 3', followers: 1400 },
    { name: 'Week 4', followers: 1800 },
    { name: 'Week 5', followers: 2200 },
    { name: 'Week 6', followers: 2800 },
  ];

  const StatCard = ({ title, value, change, icon: Icon, loading }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <h3 className="text-2xl font-bold">{value}</h3>
            )}
            {change && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-600 text-sm">+{change}%</span>
              </div>
            )}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h2>
          <p className="text-slate-500 mt-1">Track your social media performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Engagement"
          value={loading ? '-' : formatNumber(15420)}
          change={12.5}
          icon={Heart}
          loading={loading}
        />
        <StatCard
          title="Total Reach"
          value={loading ? '-' : formatNumber(89300)}
          change={8.2}
          icon={Eye}
          loading={loading}
        />
        <StatCard
          title="Followers"
          value={loading ? '-' : formatNumber(12500)}
          change={5.8}
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Avg. Engagement Rate"
          value={loading ? '-' : '4.8%'}
          change={2.1}
          icon={TrendingUp}
          loading={loading}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Engagement Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Overview</CardTitle>
              <CardDescription>Daily engagement and reach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData}>
                    <defs>
                      <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="engagement" stroke="#8884d8" fillOpacity={1} fill="url(#colorEngagement)" />
                    <Area type="monotone" dataKey="reach" stroke="#82ca9d" fillOpacity={1} fill="url(#colorReach)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Engagement by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {platformData.map((platform) => (
                    <div key={platform.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: platform.color }}
                      />
                      <span className="text-sm">{platform.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follower Growth</CardTitle>
                <CardDescription>Weekly follower growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={followerGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="followers" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#8884d8" />
                    <Bar dataKey="reach" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['18-24', '25-34', '35-44', '45-54', '55+'].map((age, i) => (
                    <div key={age} className="flex items-center gap-3">
                      <span className="w-12 text-sm">{age}</span>
                      <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${[30, 40, 20, 7, 3][i]}%` }}
                        />
                      </div>
                      <span className="w-10 text-sm text-right">{[30, 40, 20, 7, 3][i]}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Male', value: 45 },
                          { name: 'Female', value: 52 },
                          { name: 'Other', value: 3 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#ec4899" />
                        <Cell fill="#9ca3af" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                      #{i}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Post Title {i}</p>
                      <p className="text-sm text-slate-500">Posted on Instagram, Facebook</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatNumber(1000 * (6 - i))}</p>
                      <p className="text-sm text-slate-500">engagements</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
