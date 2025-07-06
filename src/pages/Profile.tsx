import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Mail, Phone, MapPin, GraduationCap, Heart, User, Camera, Upload } from 'lucide-react';
import EditProfileModal from '@/components/EditProfileModal';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileHeader from '@/components/ProfileHeader';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  gender: string | null;
  qualification: string | null;
  address: string | null;
  physical_condition: string | null;
  disabilities_disorders: string[] | null;
  avatar_url: string | null;
}

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    fetchProfile();
    setIsEditModalOpen(false);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          avatar_url: publicUrl,
          email: user.email
        });

      if (updateError) throw updateError;

      toast({
        title: "Photo Updated!",
        description: "Your profile photo has been updated successfully.",
      });

      fetchProfile();
    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      <ProfileHeader />
      
      {/* Profile Hero Section */}
      <div className="bg-gradient-romantic pt-20 pb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Photo */}
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-white/30 shadow-2xl">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="text-3xl bg-white/20 text-white">
                  {getInitials(profile?.name)}
                </AvatarFallback>
              </Avatar>
              
              {/* Photo Upload Overlay */}
              <div 
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingPhoto ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            
            {/* Profile Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {profile?.name || 'Complete Your Profile'}
              </h1>
              <p className="text-white/90 mb-4 text-lg">
                {profile?.email || user.email}
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {profile?.physical_condition && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    {profile.physical_condition}
                  </Badge>
                )}
                {profile?.gender && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    {profile.gender}
                  </Badge>
                )}
              </div>
              
              <Button 
                variant="hero"
                size="lg"
                onClick={() => setIsEditModalOpen(true)}
                className="bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto p-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <Card className="bg-card/80 backdrop-blur-sm shadow-romantic border-0 hover:shadow-glow transition-all duration-300">
            <CardHeader className="pb-4">
              <h3 className="text-xl font-semibold flex items-center text-primary">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile?.email || user.email}</p>
                </div>
              </div>
              
              {profile?.phone_number && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{profile.phone_number}</p>
                  </div>
                </div>
              )}
              
              {profile?.gender && (
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{profile.gender}</p>
                  </div>
                </div>
              )}
              
              {profile?.address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{profile.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education & Accessibility */}
          <Card className="bg-card/80 backdrop-blur-sm shadow-romantic border-0 hover:shadow-glow transition-all duration-300">
            <CardHeader className="pb-4">
              <h3 className="text-xl font-semibold flex items-center text-primary">
                <GraduationCap className="w-5 h-5 mr-2" />
                Education & Accessibility
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.qualification && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Qualification</p>
                  <p className="font-medium">{profile.qualification}</p>
                </div>
              )}
              
              {profile?.disabilities_disorders && profile.disabilities_disorders.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Disabilities/Disorders</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.disabilities_disorders.map((item, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {!profile && (
          <Card className="mt-8 text-center p-12 bg-card/80 backdrop-blur-sm shadow-romantic border-0">
            <div className="text-muted-foreground mb-6">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-romantic flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Complete Your Profile</h3>
              <p className="text-lg">Add your information to connect with others who share similar experiences and build meaningful relationships.</p>
            </div>
            <Button onClick={() => setIsEditModalOpen(true)} variant="romantic" size="lg" className="mt-6">
              <Edit className="w-5 h-5 mr-2" />
              Set Up Profile
            </Button>
          </Card>
        )}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdate={handleProfileUpdate}
        currentProfile={profile}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;