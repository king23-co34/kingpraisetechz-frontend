"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

// Landing components
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Projects from "@/components/Projects";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // Only redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      router.push(`/dashboard/${user.role}`);
    }
  }, [isAuthenticated, user, router]);

  // If logged in, optionally show a loader while redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If NOT authenticated → show full landing page
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Pricing />
      <Projects />
      <Reviews />
      <Footer />
    </>
  );
}