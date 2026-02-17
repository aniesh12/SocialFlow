export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'user' | 'admin' | 'manager';
  isActive: boolean;
  timezone: string;
  language: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  subscription: {
    plan: 'free' | 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled' | 'expired';
    expiresAt?: string;
    postsLimit: number;
    accountsLimit: number;
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccount {
  _id: string;
  user: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'pinterest';
  accountType: 'personal' | 'business' | 'creator';
  name: string;
  username: string;
  profilePicture?: string;
  coverImage?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isConnected: boolean;
  isActive: boolean;
  platformUserId: string;
  pageId?: string;
  permissions: string[];
  settings: {
    autoPublish: boolean;
    defaultHashtags: string[];
    postFormat: 'standard' | 'story' | 'reel' | 'carousel';
    bestTimeToPost: {
      enabled: boolean;
      timeSlots: { hour: number; minute: number }[];
    };
  };
  analytics: {
    totalPosts: number;
    totalEngagement: number;
    avgEngagementRate: number;
    totalReach: number;
    totalImpressions: number;
    lastUpdated: string;
  };
  lastSyncedAt: string;
  connectedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  _id: string;
  user: string;
  filename: string;
  originalName: string;
  type: 'image' | 'video' | 'gif' | 'audio' | 'document';
  mimeType: string;
  size: number;
  url: string;
  thumbnail?: string;
  preview?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  altText?: string;
  caption?: string;
  tags: string[];
  folder: string;
  isUsed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformPost {
  platform: string;
  account: SocialAccount | string;
  status: 'pending' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  platformPostId?: string;
  postUrl?: string;
  postedAt?: string;
  errorMessage?: string;
  retryCount: number;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    clicks: number;
    reach: number;
    impressions: number;
  };
}

export interface Post {
  _id: string;
  user: string;
  title?: string;
  content: string;
  media: {
    type: 'image' | 'video' | 'gif' | 'carousel';
    url: string;
    thumbnail?: string;
    filename?: string;
    size?: number;
    mimeType?: string;
    dimensions?: {
      width: number;
      height: number;
    };
    duration?: number;
    altText?: string;
    order: number;
  }[];
  platforms: PlatformPost[];
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  scheduledAt?: string;
  timezone: string;
  postType: 'post' | 'story' | 'reel' | 'video' | 'carousel' | 'poll';
  tags: string[];
  mentions: {
    platform: string;
    username: string;
    userId: string;
  }[];
  location?: {
    name: string;
    latitude: number;
    longitude: number;
    placeId: string;
  };
  linkPreview?: {
    url: string;
    title: string;
    description: string;
    image: string;
  };
  settings: {
    allowComments: boolean;
    allowSharing: boolean;
    targetAudience: 'public' | 'followers' | 'custom';
    sponsorTagged: boolean;
    sponsorInfo?: {
      name: string;
      brandId: string;
    };
  };
  analytics: {
    totalEngagement: number;
    totalReach: number;
    totalImpressions: number;
    totalClicks: number;
    engagementRate: number;
  };
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface DashboardStats {
  overview: {
    totalPosts: number;
    publishedPosts: number;
    scheduledPosts: number;
    failedPosts: number;
    draftPosts: number;
    connectedAccounts: number;
    totalEngagement: number;
    avgEngagementRate: number;
    totalReach: number;
    totalImpressions: number;
  };
  platformBreakdown: {
    _id: string;
    count: number;
    followers: number;
    posts: number;
  }[];
  recentPosts: Post[];
}

export interface AnalyticsData {
  overall: {
    totalPosts: number;
    totalEngagement: number;
    avgEngagementRate: number;
    totalReach: number;
    totalImpressions: number;
    totalFollowers: number;
    followerGrowth: number;
    totalClicks: number;
    totalViews: number;
  };
  byPlatform: {
    platform: string;
    account: SocialAccount;
    dailyMetrics: {
      date: string;
      posts: {
        total: number;
        published: number;
        scheduled: number;
        failed: number;
      };
      engagement: {
        likes: number;
        comments: number;
        shares: number;
        saves: number;
        clicks: number;
        views: number;
        total: number;
      };
      reach: number;
      impressions: number;
      followers: {
        gained: number;
        lost: number;
        net: number;
      };
      profileViews: number;
      websiteClicks: number;
    }[];
    summary: {
      totalPosts: number;
      totalEngagement: number;
      avgEngagementRate: number;
      totalReach: number;
      totalImpressions: number;
      totalFollowers: number;
      followerGrowth: number;
      bestPerformingPost?: Post;
      topHashtags: { tag: string; count: number }[];
      bestPostingTimes: { hour: number; engagement: number }[];
    };
  }[];
  contentPerformance: {
    post: Post;
    engagementRate: number;
    reach: number;
    impressions: number;
    score: number;
  }[];
  audienceDemographics: {
    age: { range: string; percentage: number }[];
    gender: { type: string; percentage: number }[];
    location: { country: string; city: string; percentage: number }[];
    interests: { name: string; percentage: number }[];
    activeHours: { hour: number; activity: number }[];
  };
  growthTrend: {
    date: string;
    followers: number;
    engagement: number;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginationData<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}
