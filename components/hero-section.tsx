"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202026-03-01%2023-59-10-4uOmQFO3qzQyLWDDKkrf2fFoWGNEdX.png')`,
        }}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      
      {/* Animated scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-px bg-cyan/30 animate-pulse" style={{ top: '30%' }} />
        <div className="absolute w-full h-px bg-red/20 animate-pulse" style={{ top: '35%', animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/5 text-cyan mb-8">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Business Building</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
            Build Your Online{" "}
            <span className="text-cyan">Business Empire</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            The complete AI platform that handles everything. From business selection to planning, 
            documentation, legal, website setup, deployment, and marketing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-cyan text-background hover:bg-cyan/90 font-semibold px-8 py-6 text-lg">
              Start Building
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Businesses Launched" },
              { value: "98%", label: "Success Rate" },
              { value: "24/7", label: "AI Support" },
              { value: "50+", label: "Countries" },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-3xl md:text-4xl font-bold text-cyan">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
