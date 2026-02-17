import React, { useState, useEffect, useRef } from 'react';
import { mediaAPI } from '@/services/api';
import type { Media } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Upload,
  Search,
  Grid3X3,
  List,
  Image as ImageIcon,
  Video,
  MoreVertical,
  Trash2,
  Download,
  Copy,
  Check
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MediaLibrary: React.FC = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, [activeTab]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (activeTab !== 'all') {
        params.type = activeTab;
      }
      const response = await mediaAPI.getMedia(params);
      setMedia(response.data.data.media);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      formData.append('folder', 'uncategorized');

      await mediaAPI.uploadMultiple(formData);
      fetchMedia();
    } catch (error) {
      console.error('Failed to upload media:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await mediaAPI.deleteMedia(id);
      fetchMedia();
    } catch (error) {
      console.error('Failed to delete media:', error);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredMedia = media.filter(item => 
    item.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Media Library</h2>
          <p className="text-slate-500 mt-1">Manage your images and videos</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-violet-600 to-indigo-600"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
            <TabsList>
              <TabsTrigger value="grid">
                <Grid3X3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Type Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            )
          ) : filteredMedia.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No media found</h3>
                <p className="text-slate-500 mb-4">Upload your first image or video</p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </Button>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item._id}
                  className={cn(
                    "group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                    selectedItems.includes(item._id)
                      ? "border-violet-500 ring-2 ring-violet-200"
                      : "border-transparent hover:border-slate-300"
                  )}
                  onClick={() => setSelectedMedia(item)}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                      <Video className="h-10 w-10 text-slate-400" />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Video
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.originalName}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(item._id);
                      }}
                    >
                      {selectedItems.includes(item._id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Selection indicator */}
                  {selectedItems.includes(item._id) && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div 
                    className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden"
                    onClick={() => setSelectedMedia(item)}
                  >
                    {item.type === 'video' ? (
                      <Video className="h-6 w-6 text-slate-400" />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.originalName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.originalName}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span>{formatFileSize(item.size)}</span>
                      <span>•</span>
                      <span className="capitalize">{item.type}</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleSelection(item._id)}
                    >
                      {selectedItems.includes(item._id) ? (
                        <Check className="h-4 w-4 text-violet-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedMedia(item)}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Media Preview Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.originalName}</DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
                {selectedMedia.type === 'video' ? (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full max-h-[400px]"
                  />
                ) : (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.originalName}
                    className="w-full max-h-[400px] object-contain"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Type</p>
                  <p className="font-medium capitalize">{selectedMedia.type}</p>
                </div>
                <div>
                  <p className="text-slate-500">Size</p>
                  <p className="font-medium">{formatFileSize(selectedMedia.size)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Uploaded</p>
                  <p className="font-medium">{new Date(selectedMedia.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Dimensions</p>
                  <p className="font-medium">
                    {selectedMedia.dimensions 
                      ? `${selectedMedia.dimensions.width} x ${selectedMedia.dimensions.height}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaLibrary;
