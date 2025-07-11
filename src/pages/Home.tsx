import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Heart, Phone, GraduationCap } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  phone_number: string | null;
  gender: string | null;
  qualification: string | null;
  address: string | null;
  physical_condition: string | null;
  disabilities_disorders: string[] | null;
  avatar_url: string | null;
}

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchProfiles();
    }
  }, [user, loading, navigate]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user?.id || ''); // Exclude current user

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setProfilesLoading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading || profilesLoading) {
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
      {/* Header */}
      <div className="bg-gradient-romantic p-6 text-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-center">
            <Heart className="w-6 h-6 inline mr-2 animate-heart-beat" />
            Community Directory
          </h1>
          <p className="text-center text-white/90 mt-2">Browse all members with their unique IDs and usernames</p>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="max-w-4xl mx-auto p-4">
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-medium mb-2 text-muted-foreground">No profiles found</h3>
            <p className="text-muted-foreground">Complete your profile to appear in the community directory!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="bg-card shadow-soft hover:shadow-romantic transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
                <CardContent className="p-6">
                  {/* Profile Header */}
                  <div className="flex flex-col items-center mb-4">
                    <Avatar className="w-20 h-20 mb-3 border-4 border-primary/20">
                      <AvatarImage src={profile.avatar_url || ''} />
                      <AvatarFallback className="text-xl bg-gradient-romantic text-white">
                        {getInitials(profile.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-lg font-semibold text-center mb-1">
                      {profile.name || 'Anonymous'}
                    </h3>
                    
                    {/* Username prominently displayed */}
                    <div className="text-center mb-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-mono">
                        @{profile.username || `user_${profile.user_id.substring(0, 8)}`}
                      </Badge>
                    </div>
                    
                    {/* User ID for reference */}
                    <div className="text-xs text-muted-foreground mb-2 font-mono">
                      ID: {profile.user_id.substring(0, 8)}...
                    </div>
                    
                    {profile.physical_condition && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
                        {profile.physical_condition}
                      </Badge>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-3">
                    {profile.gender && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Heart className="w-4 h-4 mr-2" />
                        <span>{profile.gender}</span>
                      </div>
                    )}
                    
                    {profile.address && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{profile.address}</span>
                      </div>
                    )}
                    
                    {profile.qualification && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        <span className="truncate">{profile.qualification}</span>
                      </div>
                    )}
                    
                    {profile.phone_number && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{profile.phone_number}</span>
                      </div>
                    )}
                  </div>

                  {/* Disabilities/Disorders */}
                  {profile.disabilities_disorders && profile.disabilities_disorders.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Support Needs:</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.disabilities_disorders.slice(0, 3).map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-accent/20 text-accent-foreground">
                            {item}
                          </Badge>
                        ))}
                        {profile.disabilities_disorders.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-accent/20 text-accent-foreground">
                            +{profile.disabilities_disorders.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Home;