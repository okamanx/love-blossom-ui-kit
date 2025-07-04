import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchSection from "@/components/SearchSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <SearchSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;