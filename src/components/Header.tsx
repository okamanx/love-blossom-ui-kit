import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, ChevronDown, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

const Header = ({ onOpenLogin, onOpenSignup }: HeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Logo */}
        <div className="flex items-center">
          <Heart className="w-6 h-6 text-primary mr-2 animate-heart-beat" />
          <span className="text-2xl font-bold text-foreground">
            Love<span className="text-primary">Meet</span>
          </span>
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center space-x-8">
          <a 
            href="#about" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            About
          </a>
          <a 
            href="#help" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Help
          </a>
          
          {user ? (
            /* User Profile Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Profile
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                  supabase.auth.signOut();
                  navigate('/');
                }}>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Login Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium flex items-center gap-1">
                  Login
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer" onClick={onOpenSignup}>
                  <span className="font-medium">Sign Up</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={onOpenLogin}>
                  <span>Login</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;