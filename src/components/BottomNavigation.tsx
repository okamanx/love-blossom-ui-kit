import { Home, User, PlusSquare, Heart, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      path: '/home',
      active: location.pathname === '/home'
    },
    { 
      icon: Heart, 
      label: 'Connect', 
      path: '/connect',
      active: location.pathname === '/connect'
    },
    { 
      icon: PlusSquare, 
      label: 'Posts', 
      path: '/posts',
      active: location.pathname === '/posts'
    },
    { 
      icon: MessageCircle, 
      label: 'Messages', 
      path: '/messages',
      active: location.pathname === '/messages'
    },
    { 
      icon: User, 
      label: 'Profile', 
      path: '/profile',
      active: location.pathname === '/profile'
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border shadow-romantic">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 h-12 px-2 ${
                item.active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary'
              } transition-all duration-200`}
            >
              <Icon className={`w-5 h-5 ${item.active ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;