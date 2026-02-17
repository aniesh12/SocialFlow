import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '@/services/api';
import type { Post } from '@/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  List,
  Grid3X3
} from 'lucide-react';

const platformIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin
};

const platformColors: Record<string, string> = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2'
};

const Scheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchScheduledPosts();
  }, [currentDate]);

  const fetchScheduledPosts = async () => {
    try {
      setLoading(true);
      const startDate = startOfMonth(currentDate).toISOString();
      const endDate = endOfMonth(currentDate).toISOString();
      const response = await postsAPI.getScheduledPosts({ startDate, endDate });
      setPosts(response.data.data.posts);
    } catch (error) {
      console.error('Failed to fetch scheduled posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInView = () => {
    if (viewMode === 'month') {
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfWeek(endOfMonth(currentDate));
      return eachDayOfInterval({ start, end });
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return eachDayOfInterval({ start, end });
    }
    return [];
  };

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      if (!post.scheduledAt) return false;
      return isSameDay(new Date(post.scheduledAt), date);
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Content Calendar</h2>
          <p className="text-slate-500 mt-1">Schedule and manage your posts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
            <Button
              variant={viewMode === 'month' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Week
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <Link to="/create">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      {(viewMode === 'month' || viewMode === 'week') && (
        <Card>
          <CardContent className="p-0">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 border-b">
              {weekDays.map((day) => (
                <div key={day} className="py-3 text-center text-sm font-medium text-slate-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {getDaysInView().map((date, index) => {
                const dayPosts = getPostsForDate(date);
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isToday = isSameDay(date, new Date());
                const isSelected = selectedDate && isSameDay(date, selectedDate);

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "min-h-[120px] border-b border-r p-2 cursor-pointer transition-colors",
                      !isCurrentMonth && "bg-slate-50 dark:bg-slate-900/50",
                      isSelected && "bg-violet-50 dark:bg-violet-900/20",
                      "hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={cn(
                          "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                          isToday && "bg-violet-600 text-white",
                          !isCurrentMonth && "text-slate-400"
                        )}
                      >
                        {format(date, 'd')}
                      </span>
                      {dayPosts.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {dayPosts.length}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayPosts.slice(0, 3).map((post, postIndex) => (
                        <div
                          key={postIndex}
                          className="text-xs p-1.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 truncate"
                        >
                          <div className="flex items-center gap-1">
                            {post.platforms.slice(0, 2).map((p, i) => {
                              const Icon = platformIcons[p.platform];
                              return Icon ? (
                                <Icon
                                  key={i}
                                  className="h-3 w-3"
                                  style={{ color: platformColors[p.platform] }}
                                />
                              ) : null;
                            })}
                            <span className="truncate">
                              {post.title || post.content.substring(0, 20)}...
                            </span>
                          </div>
                        </div>
                      ))}
                      {dayPosts.length > 3 && (
                        <div className="text-xs text-slate-500 text-center">
                          +{dayPosts.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No scheduled posts</p>
                    <Link to="/create">
                      <Button variant="link" className="mt-2">
                        Schedule your first post
                      </Button>
                    </Link>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post._id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        {post.media && post.media.length > 0 ? (
                          <img
                            src={post.media[0].thumbnail || post.media[0].url}
                            alt=""
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <CalendarIcon className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {post.title || post.content.substring(0, 50)}...
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex -space-x-1">
                            {post.platforms.map((platform, idx) => {
                              const PlatformIcon = platformIcons[platform.platform];
                              return PlatformIcon ? (
                                <div
                                  key={idx}
                                  className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center"
                                >
                                  <PlatformIcon
                                    className="h-3 w-3"
                                    style={{ color: platformColors[platform.platform] }}
                                  />
                                </div>
                              ) : null;
                            })}
                          </div>
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.scheduledAt && format(new Date(post.scheduledAt), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline">{post.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Selected Date Posts */}
      {selectedDate && (
        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Posts for {format(selectedDate, 'MMMM d, yyyy')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[400px] overflow-auto">
              {getPostsForDate(selectedDate).length === 0 ? (
                <p className="text-center text-slate-500 py-4">No posts scheduled for this date</p>
              ) : (
                getPostsForDate(selectedDate).map((post) => (
                  <div
                    key={post._id}
                    className="p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <p className="font-medium">{post.title || post.content.substring(0, 50)}...</p>
                    <div className="flex items-center gap-2 mt-2">
                      {post.platforms.map((p, i) => {
                        const Icon = platformIcons[p.platform];
                        return Icon ? (
                          <Icon
                            key={i}
                            className="h-4 w-4"
                            style={{ color: platformColors[p.platform] }}
                          />
                        ) : null;
                      })}
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      {post.scheduledAt && format(new Date(post.scheduledAt), 'h:mm a')}
                    </p>
                  </div>
                ))
              )}
            </div>
            <Link to="/create">
              <Button className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </Link>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Scheduler;
