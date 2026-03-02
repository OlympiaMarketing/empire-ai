"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for validating your business idea",
    features: [
      "AI Business Analysis",
      "Basic Business Plan",
      "1 Website Template",
      "Email Support",
      "Basic Analytics",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Empire Builder",
    price: "$149",
    period: "/month",
    description: "Everything you need to launch and grow",
    features: [
      "Everything in Starter",
      "Full Legal Document Suite",
      "Custom Website Builder",
      "Marketing Automation",
      "Priority Support",
      "Advanced Analytics",
      "AI Growth Advisor",
    ],
    cta: "Start Building",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For scaling empires and agencies",
    features: [
      "Everything in Empire Builder",
      "Unlimited Websites",
      "White-label Solutions",
      "Dedicated Account Manager",
      "Custom Integrations",
      "API Access",
      "SLA Guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-cyan font-medium mb-4 tracking-wide uppercase text-sm">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Path to Empire
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. Cancel anytime.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-xl border ${
                plan.popular 
                  ? "border-cyan bg-card shadow-lg shadow-cyan/10" 
                  : "border-border bg-card/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan text-background text-sm font-medium rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-cyan flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? "bg-cyan text-background hover:bg-cyan/90" 
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
