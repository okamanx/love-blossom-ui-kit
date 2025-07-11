import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Heart, Phone, GraduationCap, Filter, MessageCircle } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileHeader from '@/components/ProfileHeader';
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

const Connect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

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
        .neq('user_id', user?.id || '');

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      const profilesData = data || [];
      setProfiles(profilesData);
      setFilteredProfiles(profilesData);

      // Extract unique cities and countries
      const uniqueCities = [...new Set(profilesData.map(p => p.address?.split(',')[0]?.trim()).filter(Boolean))];
      const uniqueCountries = [...new Set(profilesData.map(p => p.address?.split(',').pop()?.trim()).filter(Boolean))];
      
      setCities(uniqueCities);
      setCountries(uniqueCountries);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setProfilesLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = profiles;

    if (cityFilter) {
      filtered = filtered.filter(profile => 
        profile.address?.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    if (countryFilter) {
      filtered = filtered.filter(profile => 
        profile.address?.toLowerCase().includes(countryFilter.toLowerCase())
      );
    }

    setFilteredProfiles(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [cityFilter, countryFilter, profiles]);

  const clearFilters = () => {
    setCityFilter('');
    setCountryFilter('');
    setFilteredProfiles(profiles);
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleMessage = (profileUserId: string) => {
    navigate(`/messages?user=${profileUserId}`);
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
      <ProfileHeader />
      
      <div className="pt-20 px-4 max-w-4xl mx-auto">
        {/* Header with Filter Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary animate-heart-beat" />
              Connect by Location
            </h1>
            <p className="text-muted-foreground">Find people near you</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Cities</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Country</label>
                  <Select value={countryFilter} onValueChange={setCountryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Countries</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleFilter} className="flex-1">Apply</Button>
                  <Button onClick={clearFilters} variant="outline">Clear</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-medium mb-2 text-muted-foreground">No profiles found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="bg-card shadow-soft hover:shadow-romantic transition-all duration-300 transform hover:scale-[1.02]">
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
                    
                    {profile.username && (
                      <p className="text-sm text-muted-foreground mb-2">@{profile.username}</p>
                    )}
                    
                    {profile.physical_condition && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
                        {profile.physical_condition}
                      </Badge>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-3 mb-4">
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
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => handleMessage(profile.user_id)}
                    className="w-full bg-gradient-romantic hover:bg-gradient-romantic/90 text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>

                  {/* Disabilities/Disorders */}
                  {profile.disabilities_disorders && profile.disabilities_disorders.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Support Needs:</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.disabilities_disorders.slice(0, 2).map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-accent/20 text-accent-foreground">
                            {item}
                          </Badge>
                        ))}
                        {profile.disabilities_disorders.length > 2 && (
                          <Badge variant="secondary" className="text-xs bg-accent/20 text-accent-foreground">
                            +{profile.disabilities_disorders.length - 2}
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

export default Connect;