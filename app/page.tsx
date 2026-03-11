import { PageWrapper } from "@/app/components/layout/PageWrapper"
import { Navbar } from "@/app/components/layout/Navbar"
import { Footer } from "@/app/components/layout/Footer"
import { Hero } from "@/app/components/sections/Hero"
import { ProblemSection } from "@/app/components/sections/ProblemSection"
import { SolutionSection } from "@/app/components/sections/SolutionSection"
import { HowItWorks } from "@/app/components/sections/HowItWorks"
import { AdFormats } from "@/app/components/sections/AdFormats"
import { StatBar } from "@/app/components/sections/StatBar"
import { PricingPreview } from "@/app/components/sections/PricingPreview"
import { WhyClipGanji } from "@/app/components/sections/WhyClipGanji"
import { ContactCTA } from "@/app/components/sections/ContactCTA"
import { Ticker } from "@/app/components/ui/Ticker"

export default function Home() {
  return (
    <PageWrapper>
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <AdFormats />
        <StatBar />
        <PricingPreview />
        <Ticker />
        <WhyClipGanji />
        <ContactCTA />
      </main>
      <Footer />
    </PageWrapper>
  )
}
