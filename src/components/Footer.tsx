import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Heart className="w-8 h-8 mr-2 animate-heart-beat" />
              <h3 className="text-2xl font-bold">PerfectMatch</h3>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed mb-4">
              Connecting hearts and souls across the world. We believe everyone deserves 
              to find their perfect match and build a beautiful life together.
            </p>
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  className="w-4 h-4 fill-primary-foreground/60 text-primary-foreground/60 animate-float" 
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Browse Profiles</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Membership Plans</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Help & Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>Email: support@perfectmatch.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Mon-Sun: 24/7 Available</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2024 PerfectMatch. Made with <Heart className="w-4 h-4 inline fill-red-400 text-red-400 animate-heart-beat" /> for finding true love.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;