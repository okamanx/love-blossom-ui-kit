import { Card, CardContent } from "@/components/ui/card";
import { Heart, Flower } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Heart,
      title: "AI-Powered Matching",
      description: "Our advanced algorithm analyzes compatibility based on values, interests, and lifestyle preferences to find your perfect match."
    },
    {
      icon: Flower,
      title: "Verified Profiles",
      description: "All profiles are thoroughly verified to ensure authenticity and safety, giving you peace of mind while searching for love."
    },
    {
      icon: Heart,
      title: "Privacy Protection",
      description: "Your personal information is protected with bank-level security. Control who sees your profile and when."
    },
    {
      icon: Flower,
      title: "Success Stories",
      description: "Join thousands of couples who found their soulmate through our platform. Read their inspiring love stories."
    },
    {
      icon: Heart,
      title: "24/7 Customer Support",
      description: "Our dedicated support team is available round the clock to help you with any questions or concerns."
    },
    {
      icon: Flower,
      title: "Mobile App",
      description: "Stay connected on the go with our feature-rich mobile app. Available on iOS and Android platforms."
    }
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose <span className="text-primary">Our Platform?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We provide the most comprehensive and secure matrimonial experience, 
            helping you find not just a partner, but your perfect life companion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-romantic transition-all duration-300 transform hover:scale-105 border-primary/10 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-romantic rounded-full flex items-center justify-center group-hover:animate-heart-beat">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Decorative Elements */}
        <div className="relative mt-16">
          <div className="absolute top-0 left-1/4 opacity-10">
            <Heart className="w-12 h-12 text-primary animate-float" />
          </div>
          <div className="absolute top-8 right-1/4 opacity-10">
            <Flower className="w-10 h-10 text-primary animate-float [animation-delay:2s]" />
          </div>
          <div className="absolute -top-4 left-3/4 opacity-10">
            <Heart className="w-8 h-8 text-primary animate-float [animation-delay:4s]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;