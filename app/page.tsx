import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ProcessSection } from "@/components/process-section"
import { PricingSection } from "@/components/pricing-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="process">
        <ProcessSection />
      </section>
      <section id="pricing">
        <PricingSection />
      </section>
      <CTASection />
      <Footer />
    </main>
  )
}
