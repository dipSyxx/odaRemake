"use client";

import { Header } from "@/components/shared/header";
import {
  HomeBanner,
  HomeHero,
  HomeWelcome,
  HomeFeatures,
  HomeLowPrices,
  HomeBenefits,
  HomeRecipes,
  HomeDelivery,
  HomeChatButton,
  Footer,
} from "@/components/shared/home";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HomeBanner />
      <HomeHero />
      <HomeWelcome />
      <HomeFeatures />
      <HomeLowPrices />
      <HomeBenefits />
      <HomeRecipes />
      <HomeDelivery />
      <Footer />
      <HomeChatButton />
    </div>
  );
}
