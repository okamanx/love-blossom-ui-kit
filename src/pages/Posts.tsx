import { PlusSquare } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileHeader from '@/components/ProfileHeader';
import { Card, CardContent } from '@/components/ui/card';

const Posts = () => {
  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      <ProfileHeader />
      
      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-romantic flex items-center justify-center">
            <PlusSquare className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-foreground">Posts & Stories</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Share your experiences and stories with the community.
          </p>
          <Card className="bg-card/80 backdrop-blur-sm shadow-romantic border-0">
            <CardContent className="p-8">
              <p className="text-muted-foreground">
                Post creation and management features are coming soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Posts;