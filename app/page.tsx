'use client'

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
} from '@/components/shared/home'

export default function HomePage() {
  return (
    <>
      <HomeBanner />
      <HomeHero />
      <HomeWelcome />
      <HomeFeatures />
      <HomeLowPrices />
      <HomeBenefits />
      <HomeRecipes />
      <HomeDelivery />
      <HomeChatButton />
    </>
  )
}
