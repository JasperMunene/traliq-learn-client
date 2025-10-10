"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CoursesHero from "@/components/Courses/CoursesHero";
import CoursesGrid from "@/components/Courses/CoursesGrid";
import CoursesFilters from "@/components/Courses/CoursesFilters";

export default function CoursesClient() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <CoursesHero />
        
        {/* Filters and Grid */}
        <section className="bg-gray-50 py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <CoursesFilters />
            <CoursesGrid />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
