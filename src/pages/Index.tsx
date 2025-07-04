import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import SignupModal from "@/components/SignupModal";

const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleOpenLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const handleOpenSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleCloseModals = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Header onOpenLogin={handleOpenLogin} onOpenSignup={handleOpenSignup} />
      <HeroSection onOpenSignup={handleOpenSignup} />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
      
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={handleCloseModals}
        onSwitchToSignup={handleOpenSignup}
      />
      <SignupModal 
        isOpen={isSignupOpen}
        onClose={handleCloseModals}
        onSwitchToLogin={handleOpenLogin}
      />
    </div>
  );
};

export default Index;