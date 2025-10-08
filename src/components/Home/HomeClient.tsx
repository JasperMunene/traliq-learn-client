"use client";

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Hero from "@/components/Home/Hero";
import TrustBar from "@/components/Home/TrustBar";
import LiveSessionsBanner from "@/components/Home/LiveSessionsBanner";
import Courses from "@/components/Home/Courses";
import HowItWorks from "@/components/Home/HowItWorks";
import DualValueProp from "@/components/Home/DualValueProp";
import Features from "@/components/Home/Features";
import Testimonials from "@/components/Home/Testimonials";
import Pricing from "@/components/Home/Pricing";
import FAQ from "@/components/Home/FAQ";
import FinalCTA from "@/components/Home/FinalCTA";
import Footer from "@/components/layout/Footer";

export default function HomeClient() {
  const [loadedSections, setLoadedSections] = useState<Record<string, boolean>>({});

  const markLoaded = (key: string) => {
    setLoadedSections(prev => ({ ...prev, [key]: true }));
  };

  const allLoaded = useMemo(() => {
    // Sections that fetch data
    const keys = ["banner", "courses"];
    return keys.every(k => loadedSections[k]);
  }, [loadedSections]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 w-full overflow-x-hidden relative">
      {/* Universal top progress indicator while loading */}
      {!allLoaded && (
        <div className="fixed top-0 left-0 right-0 h-1 z-50">
          <div className="h-full bg-blue-600 animate-pulse" style={{ width: "65%" }} />
        </div>
      )}

      <Header />
      <main>
        {/* 1. Hero Section - Above the Fold */}
        <Hero />

        {/* 2. Trust Bar - Social Proof */}
        <TrustBar />

        {/* 3. Live Sessions Urgency Banner */}
        <LiveSessionsBanner onLoaded={() => markLoaded("banner")} />

        {/* 4. Featured Courses with Urgency Elements */}
        <Courses onLoaded={() => markLoaded("courses")} />

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
  );
}
