import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Mail, Phone, MapPin, GraduationCap, Heart, User } from 'lucide-react';
import EditProfileModal from '@/components/EditProfileModal';
import { useNavigate } from 'react-router-dom';

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
}

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-romantic p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <Button 
              variant="outline" 
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Profile Header */}
          <div className="flex items-center space-x-6">
            <Avatar className="w-24 h-24 border-4 border-white/20">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl bg-white/20 text-white">
                {getInitials(profile?.name)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {profile?.name || 'Welcome!'}
              </h2>
              <p className="text-white/80 mb-4">
                {profile?.email || user.email}
              </p>
              {profile?.physical_condition && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {profile.physical_condition}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto p-6 -mt-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="bg-card shadow-soft">
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
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
          <Card className="bg-card shadow-soft">
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-primary" />
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
          <Card className="mt-6 text-center p-8 bg-card shadow-soft">
            <div className="text-muted-foreground mb-4">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-medium mb-2">Complete Your Profile</h3>
              <p>Add your information to connect with others who share similar experiences.</p>
            </div>
            <Button onClick={() => setIsEditModalOpen(true)} variant="romantic" className="mt-4">
              <Edit className="w-4 h-4 mr-2" />
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
    </div>
  );
};

export default Profile;