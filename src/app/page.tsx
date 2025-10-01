import React from 'react'
import Header  from '@/components/layout/Header';
import Hero from '@/components/Home/Hero';
import TrustBar from '@/components/Home/TrustBar';
import LiveSessionsBanner from '@/components/Home/LiveSessionsBanner';
import Courses from '@/components/Home/Courses';
import HowItWorks from '@/components/Home/HowItWorks';
import DualValueProp from '@/components/Home/DualValueProp';
import Features from '@/components/Home/Features';
import Testimonials from '@/components/Home/Testimonials';
import Pricing from '@/components/Home/Pricing';
import FAQ from '@/components/Home/FAQ';
import FinalCTA from '@/components/Home/FinalCTA';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
      <>
        <div className="min-h-screen bg-gray-50 text-gray-900 w-full overflow-x-hidden">
        <Header />
          <main>
            {/* 1. Hero Section - Above the Fold */}
            <Hero />
            
            {/* 2. Trust Bar - Social Proof */}
            <TrustBar />
            
            {/* 3. Live Sessions Urgency Banner */}
            <LiveSessionsBanner />
            
            {/* 4. Featured Courses with Urgency Elements */}
            <Courses />
            
            {/* 5. How It Works - 3-Step Process */}
            <HowItWorks />
            
            {/* 6. Dual Value Proposition - Learners + Tutors */}
            <DualValueProp />
            
            {/* 7. Features - Live + Replay Benefits */}
            <Features />
            
            {/* 8. Social Proof & Testimonials */}
            <Testimonials />
            
            {/* 9. Pricing & Plans */}
            <Pricing />
            
            {/* 10. FAQ */}
            <FAQ />
            
            {/* 11. Final CTA - Dual Conversion */}
            <FinalCTA />
          </main>
          
          {/* 12. Footer */}
          <Footer />
        </div>
      </>
  )
}
