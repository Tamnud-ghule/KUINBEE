/**
 * LandingPage component - Main container for the B2B data-service landing page
 * Renders all section components in sequence for a complete, responsive landing page
 */
import React from 'react';
import SiteLayout from '@/components/common/SiteLayout';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import IndustriesServed from '@/components/landing/IndustriesServed';
// SampleDatasetPreview removed per user request
import SecurityCompliance from '@/components/landing/SecurityCompliance';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import FAQs from '@/components/landing/FAQs';
import ContactCTA from '@/components/landing/ContactCTA';
import Footer from '@/components/landing/Footer';

const LandingPage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <IndustriesServed />
      <SecurityCompliance />
      <WhyChooseUs />
      <FAQs />
      <ContactCTA />
      <Footer />
    </>
  );
};

export default LandingPage;
