import { Heart } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileHeader from '@/components/ProfileHeader';
import { Card, CardContent } from '@/components/ui/card';

const Connect = () => {
  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      <ProfileHeader />
      
      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-romantic flex items-center justify-center">
            <Heart className="w-12 h-12 text-white animate-heart-beat" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-foreground">Connect with Others</h1>
          <p className="text-lg text-muted-foreground mb-8">
            This feature is coming soon! You'll be able to connect with people who share similar experiences.
          </p>
          <Card className="bg-card/80 backdrop-blur-sm shadow-romantic border-0">
            <CardContent className="p-8">
              <p className="text-muted-foreground">
                We're working hard to bring you meaningful connections. Stay tuned!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Connect;