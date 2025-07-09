import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';

interface Profile {
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

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate: () => void;
  currentProfile: Profile | null;
}

const EditProfileModal = ({ isOpen, onClose, onProfileUpdate, currentProfile }: EditProfileModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newDisability, setNewDisability] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone_number: '',
    gender: '',
    qualification: '',
    address: '',
    physical_condition: '',
    disabilities_disorders: [] as string[]
  });

  useEffect(() => {
    if (currentProfile) {
      setFormData({
        name: currentProfile.name || '',
        username: currentProfile.username || '',
        email: currentProfile.email || '',
        phone_number: currentProfile.phone_number || '',
        gender: currentProfile.gender || '',
        qualification: currentProfile.qualification || '',
        address: currentProfile.address || '',
        physical_condition: currentProfile.physical_condition || '',
        disabilities_disorders: currentProfile.disabilities_disorders || []
      });
    } else if (user) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [currentProfile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const profileData = {
        user_id: user.id,
        name: formData.name || null,
        username: formData.username || null,
        email: formData.email || null,
        phone_number: formData.phone_number || null,
        gender: formData.gender || null,
        qualification: formData.qualification || null,
        address: formData.address || null,
        physical_condition: formData.physical_condition || null,
        disabilities_disorders: formData.disabilities_disorders.length > 0 ? formData.disabilities_disorders : null
      };

      const { error } = currentProfile
        ? await supabase
            .from('profiles')
            .update(profileData)
            .eq('user_id', user.id)
        : await supabase
            .from('profiles')
            .insert(profileData);

      if (error) {
        console.error('Error saving profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to save profile. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully!'
      });
      
      onProfileUpdate();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addDisability = () => {
    if (newDisability.trim() && !formData.disabilities_disorders.includes(newDisability.trim())) {
      setFormData(prev => ({
        ...prev,
        disabilities_disorders: [...prev.disabilities_disorders, newDisability.trim()]
      }));
      setNewDisability('');
    }
  };

  const removeDisability = (disability: string) => {
    setFormData(prev => ({
      ...prev,
      disabilities_disorders: prev.disabilities_disorders.filter(item => item !== disability)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {currentProfile ? 'Edit Profile' : 'Complete Profile'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter a unique username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              value={formData.qualification}
              onChange={(e) => handleInputChange('qualification', e.target.value)}
              placeholder="Enter your qualification"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your address"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="physical-condition">Physical Condition</Label>
            <Input
              id="physical-condition"
              value={formData.physical_condition}
              onChange={(e) => handleInputChange('physical_condition', e.target.value)}
              placeholder="Describe your physical condition"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Disabilities/Disorders</Label>
            <div className="flex space-x-2">
              <Input
                value={newDisability}
                onChange={(e) => setNewDisability(e.target.value)}
                placeholder="Add disability or disorder"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDisability())}
              />
              <Button type="button" onClick={addDisability} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.disabilities_disorders.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.disabilities_disorders.map((disability, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20 pr-1"
                  >
                    {disability}
                    <button
                      type="button"
                      onClick={() => removeDisability(disability)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="romantic" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;