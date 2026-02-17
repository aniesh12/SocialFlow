import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI, accountsAPI } from '@/services/api';
import type { SocialAccount } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Image as ImageIcon,
  Smile,
  Hash,
  AtSign,
  Calendar as CalendarIcon,
  Clock,
  Send,
  Save,
  X,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Check,
  Globe,
  Lock,
  Users
} from 'lucide-react';

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

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [media, setMedia] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [isScheduling, setIsScheduling] = useState(false);
  const [postType, setPostType] = useState('post');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  // Platform-specific content
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [platformContent, _setPlatformContent] = useState<Record<string, string>>({});

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAccounts({ isConnected: true });
      setAccounts(response.data.data.accounts);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const handlePlatformToggle = (accountId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setMedia(prev => [...prev, ...files]);
      const previews = files.map(file => URL.createObjectURL(file));
      setMediaPreview(prev => [...prev, ...previews]);
    }
  };

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(mediaPreview[index]);
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
  };

  const getCharacterLimit = (platform: string) => {
    const limits: Record<string, number> = {
      twitter: 280,
      linkedin: 3000,
      facebook: 63206,
      instagram: 2200
    };
    return limits[platform] || 5000;
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }

    setIsLoading(true);

    try {
      const platforms = selectedPlatforms.map(accountId => {
        const account = accounts.find(a => a._id === accountId);
        return {
          account: accountId,
          platform: account?.platform
        };
      });

      const postData: any = {
        content,
        platforms,
        postType,
        media: mediaPreview.map((url, index) => ({
          type: media[index]?.type.startsWith('video/') ? 'video' : 'image',
          url,
          order: index
        }))
      };

      if (isScheduling && scheduleDate) {
        const scheduledDateTime = new Date(scheduleDate);
        const [hours, minutes] = scheduleTime.split(':');
        scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));
        postData.scheduledAt = scheduledDateTime.toISOString();
      }

      await postsAPI.createPost(postData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformPreview = (platform: string) => {
    const platformContent_text = platformContent[platform] || content;
    const characterLimit = getCharacterLimit(platform);
    const isOverLimit = platformContent_text.length > characterLimit;

    switch (platform) {
      case 'twitter':
        return (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-200" />
              <div>
                <p className="font-bold text-sm">Your Name</p>
                <p className="text-slate-500 text-sm">@username</p>
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap mb-3">{platformContent_text}</p>
            {mediaPreview.length > 0 && (
              <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                {mediaPreview.slice(0, 4).map((url, i) => (
                  <img key={i} src={url} alt="" className="w-full h-32 object-cover" />
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-3 text-slate-500 text-sm">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className={isOverLimit ? 'text-red-500' : ''}>
                {platformContent_text.length}/{characterLimit}
              </span>
            </div>
          </div>
        );

      case 'instagram':
        return (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-w-md">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <span className="font-semibold text-sm">username</span>
              </div>
            </div>
            {mediaPreview.length > 0 ? (
              <div className="aspect-square bg-slate-100">
                <img src={mediaPreview[0]} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-square bg-slate-100 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-slate-300" />
              </div>
            )}
            <div className="p-3">
              <div className="flex items-center gap-4 mb-2">
                <HeartIcon className="h-6 w-6" />
                <MessageIcon className="h-6 w-6" />
                <SendIcon className="h-6 w-6" />
              </div>
              <p className="text-sm">
                <span className="font-semibold mr-2">username</span>
                {platformContent_text}
              </p>
            </div>
          </div>
        );

      case 'facebook':
        return (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-200" />
              <div>
                <p className="font-semibold text-sm">Your Page Name</p>
                <p className="text-slate-500 text-xs">Just now</p>
              </div>
            </div>
            <p className="text-sm mb-3">{platformContent_text}</p>
            {mediaPreview.length > 0 && (
              <div className="rounded-lg overflow-hidden">
                <img src={mediaPreview[0]} alt="" className="w-full h-48 object-cover" />
              </div>
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t text-slate-500 text-sm">
              <span>Like</span>
              <span>Comment</span>
              <span>Share</span>
            </div>
          </div>
        );

      case 'linkedin':
        return (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div>
                <p className="font-semibold text-sm">Your Name</p>
                <p className="text-slate-500 text-xs">Your Headline</p>
                <p className="text-slate-400 text-xs">Just now</p>
              </div>
            </div>
            <p className="text-sm mb-3">{platformContent_text}</p>
            {mediaPreview.length > 0 && (
              <div className="rounded-lg overflow-hidden">
                <img src={mediaPreview[0]} alt="" className="w-full h-48 object-cover" />
              </div>
            )}
            <div className="flex items-center gap-6 mt-3 pt-3 border-t text-slate-500 text-sm">
              <span>Like</span>
              <span>Comment</span>
              <span>Repost</span>
              <span>Send</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Post</h2>
          <p className="text-slate-500 mt-1">Craft and schedule content for your social channels</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => handlePublish()}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            onClick={() => handlePublish()}
            disabled={isLoading || selectedPlatforms.length === 0}
            className="bg-gradient-to-r from-violet-600 to-indigo-600"
          >
            <Send className="h-4 w-4 mr-2" />
            {isScheduling ? 'Schedule' : 'Publish Now'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Post Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder="What would you like to share?"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <span className={cn(
                        "text-xs",
                        content.length > 5000 ? "text-red-500" : "text-slate-400"
                      )}>
                        {content.length}/5000
                      </span>
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add Media
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" size="sm">
                      <Smile className="h-4 w-4 mr-2" />
                      Emoji
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      <Hash className="h-4 w-4 mr-2" />
                      Hashtags
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      <AtSign className="h-4 w-4 mr-2" />
                      Mention
                    </Button>
                  </div>

                  {/* Media Preview */}
                  {mediaPreview.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {mediaPreview.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeMedia(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Platform Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {accounts.map((account) => {
                      const PlatformIcon = platformIcons[account.platform];
                      const isSelected = selectedPlatforms.includes(account._id);
                      
                      return (
                        <button
                          key={account._id}
                          onClick={() => handlePlatformToggle(account._id)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                            isSelected 
                              ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20" 
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                          )}
                        >
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${platformColors[account.platform]}20` }}
                          >
                            <PlatformIcon 
                              className="h-5 w-5" 
                              style={{ color: platformColors[account.platform] }}
                            />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{account.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{account.platform}</p>
                          </div>
                          {isSelected && (
                            <Check className="h-5 w-5 text-violet-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {accounts.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-slate-500">No connected accounts</p>
                      <Button variant="link" className="mt-2">
                        Connect an account
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scheduling */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Schedule</CardTitle>
                    <Switch 
                      checked={isScheduling} 
                      onCheckedChange={setIsScheduling}
                    />
                  </div>
                </CardHeader>
                {isScheduling && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {scheduleDate ? format(scheduleDate, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={scheduleDate}
                              onSelect={setScheduleDate}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Platform Previews</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-6">
                      {selectedPlatforms.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-slate-500">Select platforms to see previews</p>
                        </div>
                      ) : (
                        selectedPlatforms.map((accountId) => {
                          const account = accounts.find(a => a._id === accountId);
                          if (!account) return null;
                          
                          return (
                            <div key={accountId} className="border-b pb-6 last:border-0">
                              <div className="flex items-center gap-2 mb-4">
                                {React.createElement(platformIcons[account.platform], {
                                  className: "h-5 w-5",
                                  style: { color: platformColors[account.platform] }
                                })}
                                <span className="font-medium capitalize">{account.platform}</span>
                                <span className="text-slate-400">- {account.name}</span>
                              </div>
                              {getPlatformPreview(account.platform)}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Post Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['post', 'story', 'reel', 'video'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setPostType(type)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                        postType === type
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Audience</Label>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">Public</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Followers</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Only Me</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Icon components for previews
const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export default CreatePost;
