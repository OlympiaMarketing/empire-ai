"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 via-transparent to-red/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Empire?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of entrepreneurs who have transformed their ideas into thriving online businesses. 
            Start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-cyan text-background hover:bg-cyan/90 font-semibold px-8 py-6 text-lg">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary px-8 py-6 text-lg">
              Schedule Demo
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </div>
    </section>
  )
}
