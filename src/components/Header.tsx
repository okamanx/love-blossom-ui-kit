import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Navigation */}
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
          
          {/* Login Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-medium">
                Login
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <span className="font-medium">Sign Up</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <span>Login with Email</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <span>Login with Phone</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Logo */}
        <div className="flex items-center">
          <Heart className="w-6 h-6 text-primary mr-2 animate-heart-beat" />
          <span className="text-2xl font-bold text-foreground">
            Love<span className="text-primary">Meet</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;