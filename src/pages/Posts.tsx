import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusSquare, Camera, X, Heart, MessageCircle, Share } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileHeader from '@/components/ProfileHeader';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
  profiles: {
    name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

const Posts = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchPosts();
    }
  }, [user, loading, navigate]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            name,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('posts')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleCreatePost = async () => {
    if (!user || (!newPost.trim() && !selectedImage)) return;

    setUploading(true);
    try {
      let imageUrl = null;

      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
        if (!imageUrl) {
          toast({
            title: 'Error',
            description: 'Failed to upload image. Please try again.',
            variant: 'destructive'
          });
          return;
        }
      }

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: newPost.trim() || null,
          image_url: imageUrl
        });

      if (error) {
        console.error('Error creating post:', error);
        toast({
          title: 'Error',
          description: 'Failed to create post. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Post created successfully!'
      });

      setNewPost('');
      removeImage();
      setIsCreating(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading || postsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      <ProfileHeader />
      
      <div className="pt-20 px-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PlusSquare className="w-6 h-6 text-primary" />
            Posts & Stories
          </h1>
          <p className="text-muted-foreground">Share your experiences with the community</p>
        </div>

        {/* Create Post Button */}
        {!isCreating && (
          <Card className="mb-6 bg-card/80 backdrop-blur-sm shadow-soft">
            <CardContent className="p-4">
              <Button
                onClick={() => setIsCreating(true)}
                className="w-full bg-gradient-romantic hover:bg-gradient-romantic/90 text-white"
              >
                <PlusSquare className="w-4 h-4 mr-2" />
                Create New Post
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Post Form */}
        {isCreating && (
          <Card className="mb-6 bg-card/80 backdrop-blur-sm shadow-soft">
            <CardContent className="p-4">
              <div className="space-y-4">
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      onClick={removeImage}
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Add Photo
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setIsCreating(false);
                        setNewPost('');
                        removeImage();
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      disabled={uploading || (!newPost.trim() && !selectedImage)}
                      size="sm"
                      className="bg-gradient-romantic hover:bg-gradient-romantic/90 text-white"
                    >
                      {uploading ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <PlusSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-medium mb-2 text-muted-foreground">No posts yet</h3>
              <p className="text-muted-foreground">Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="bg-card/80 backdrop-blur-sm shadow-soft">
                <CardContent className="p-6">
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.profiles?.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-romantic text-white text-sm">
                        {getInitials(post.profiles?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{post.profiles?.name || 'Anonymous'}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {post.profiles?.username && <span>@{post.profiles.username}</span>}
                        <span>•</span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  {post.content && (
                    <p className="mb-4 text-foreground leading-relaxed">{post.content}</p>
                  )}

                  {/* Post Image */}
                  {post.image_url && (
                    <div className="mb-4">
                      <img
                        src={post.image_url}
                        alt="Post content"
                        className="w-full h-auto max-h-96 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Heart className="w-4 h-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Comment
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Posts;