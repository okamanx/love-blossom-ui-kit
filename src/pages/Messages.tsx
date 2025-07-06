import { MessageCircle } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileHeader from '@/components/ProfileHeader';
import { Card, CardContent } from '@/components/ui/card';

const Messages = () => {
  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      <ProfileHeader />
      
      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-romantic flex items-center justify-center">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-foreground">Messages</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Chat with other members of the community.
          </p>
          <Card className="bg-card/80 backdrop-blur-sm shadow-romantic border-0">
            <CardContent className="p-8">
              <p className="text-muted-foreground">
                Real-time messaging features are coming soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Messages;