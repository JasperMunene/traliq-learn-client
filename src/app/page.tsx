import React from 'react'
import Header  from '@/components/layout/Header';
import Hero from '@/components/Home/Hero';
import Features from '@/components/Home/Features';
import Courses from '@/components/Home/Courses';
import Testimonials from '@/components/Home/Testimonials';
import Pricing from '@/components/Home/Pricing';
import FAQ from '@/components/Home/FAQ';
import CTA from '@/components/Home/CTA';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
      <>
        <div className="min-h-screen bg-gray-50 text-gray-900 w-full overflow-x-hidden">
        <Header />
          <main>
            <Hero />
            <Features />
              <Courses />
              <Testimonials />
              <Pricing />
              <FAQ />
              <CTA />
          </main>
            <Footer />
        </div>
      </>
  )
}
