import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import heroImage from "@/assets/hero-couple.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute top-1/4 left-1/4 w-6 h-6 text-white/20 animate-float" />
        <Heart className="absolute top-1/3 right-1/4 w-4 h-4 text-white/30 animate-float [animation-delay:2s]" />
        <Heart className="absolute bottom-1/3 left-1/3 w-5 h-5 text-white/25 animate-float [animation-delay:4s]" />
        <Heart className="absolute top-2/3 right-1/3 w-3 h-3 text-white/20 animate-float [animation-delay:6s]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your
            <span className="block bg-gradient-to-r from-white to-romantic-pink bg-clip-text text-transparent animate-glow">
              Perfect Match
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-slide-up">
            Join thousands of happy couples who found their soulmate through our platform. 
            Start your journey to eternal love today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up [animation-delay:0.5s]">
            <Button variant="hero" size="xl" className="min-w-[200px]">
              <Heart className="mr-2 animate-heart-beat" />
              Start Your Journey
            </Button>
            <Button variant="elegant" size="xl" className="min-w-[200px]">
              Browse Profiles
            </Button>
          </div>

          <div className="mt-12 text-white/80 animate-slide-up [animation-delay:1s]">
            <p className="text-lg">Over 10,000+ successful marriages</p>
            <div className="flex justify-center items-center gap-2 mt-2">
              {[...Array(5)].map((_, i) => (
                <Heart key={i} className="w-4 h-4 fill-romantic-pink text-romantic-pink animate-heart-beat" style={{animationDelay: `${i * 0.2}s`}} />
              ))}
              <span className="ml-2">Trusted by millions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-ping"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;