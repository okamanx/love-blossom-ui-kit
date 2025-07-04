import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya & Rajesh",
      location: "Mumbai, India",
      story: "We found each other through this amazing platform. The compatibility matching was so accurate - we shared the same values and dreams. Now we're happily married for 2 years!",
      rating: 5
    },
    {
      name: "Sneha & Arjun",
      location: "Bangalore, India", 
      story: "After months of searching, I found my soulmate here. The verification process gave me confidence, and the support team was incredibly helpful throughout our journey.",
      rating: 5
    },
    {
      name: "Kavya & Vikram",
      location: "Delhi, India",
      story: "What started as a simple conversation has blossomed into the most beautiful relationship. We're planning our wedding next month. Thank you for bringing us together!",
      rating: 5
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-soft">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Love Stories That <span className="text-primary">Inspire</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real couples, real love stories. See how our platform has helped thousands 
            find their perfect match and build beautiful relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-romantic transition-all duration-300 transform hover:scale-105 border-primary/10 animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                {/* Rating Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Heart 
                      key={i} 
                      className="w-5 h-5 fill-primary text-primary animate-heart-beat" 
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>

                {/* Story */}
                <blockquote className="text-muted-foreground text-center leading-relaxed mb-6 italic">
                  "{testimonial.story}"
                </blockquote>

                {/* Couple Names & Location */}
                <div className="text-center">
                  <h4 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {testimonial.location}
                  </p>
                </div>

                {/* Decorative Hearts */}
                <div className="flex justify-center mt-4 space-x-2">
                  <Heart className="w-3 h-3 text-primary/30 animate-float" />
                  <Heart className="w-2 h-2 text-primary/20 animate-float [animation-delay:1s]" />
                  <Heart className="w-3 h-3 text-primary/30 animate-float [animation-delay:2s]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-slide-up [animation-delay:0.6s]">
          <div className="bg-card rounded-2xl p-8 shadow-soft max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Write Your Love Story?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of couples who found their perfect match. Your soulmate is waiting!
            </p>
            <div className="flex justify-center">
              <Heart className="w-6 h-6 text-primary animate-heart-beat mr-2" />
              <span className="text-primary font-semibold">Start your journey today</span>
              <Heart className="w-6 h-6 text-primary animate-heart-beat ml-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;