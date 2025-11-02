'use client'

import { Analytics } from '@/home/components/Analytics'
import { ApplicationManagement } from '@/home/components/ApplicationManagement'
import { Features } from '@/home/components/Features'
import { FinalCTA } from '@/home/components/FinalCTA'
import { Footer } from '@/home/components/Footer'
import { Hero } from '@/home/components/Hero'
import { HowItWorks } from '@/home/components/HowItWorks'
import { ProblemSolution } from '@/home/components/ProblemSolution'
import { TechnicalHighlights } from '@/home/components/TechnicalHighlights'
import { UseCases } from '@/home/components/UseCases'

export default function Home() {
  return (
    <div className="min-h-screen max-w-screen overflow-hidden">
      <Hero />
      <ProblemSolution />
      <Features />
      <Analytics />
      <HowItWorks />
      <ApplicationManagement />
      <UseCases />
      <TechnicalHighlights />
      <FinalCTA />
      <Footer />
    </div>
  )
}