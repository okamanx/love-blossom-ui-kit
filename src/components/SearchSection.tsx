import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";

const SearchSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-soft">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Your <span className="text-primary">Ideal Partner</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use our advanced search to find someone who shares your values, interests, and dreams
          </p>
        </div>

        <Card className="shadow-romantic border-primary/10 animate-slide-up">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Age Range</label>
                <Select>
                  <SelectTrigger className="bg-background border-primary/20 focus:border-primary">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-25">18-25 years</SelectItem>
                    <SelectItem value="26-35">26-35 years</SelectItem>
                    <SelectItem value="36-45">36-45 years</SelectItem>
                    <SelectItem value="46+">46+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Religion</label>
                <Select>
                  <SelectTrigger className="bg-background border-primary/20 focus:border-primary">
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindu">Hindu</SelectItem>
                    <SelectItem value="muslim">Muslim</SelectItem>
                    <SelectItem value="christian">Christian</SelectItem>
                    <SelectItem value="sikh">Sikh</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Location</label>
                <Input 
                  placeholder="Enter city or state" 
                  className="bg-background border-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Education</label>
                <Select>
                  <SelectTrigger className="bg-background border-primary/20 focus:border-primary">
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="postgraduate">Post Graduate</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-center">
              <Button variant="romantic" size="lg" className="hover:animate-heart-beat">
                <Heart className="mr-2" />
                Search Perfect Match
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { number: "50K+", label: "Active Profiles" },
            { number: "10K+", label: "Success Stories" },
            { number: "95%", label: "Match Accuracy" },
            { number: "24/7", label: "Support Available" }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-card rounded-lg shadow-soft animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;