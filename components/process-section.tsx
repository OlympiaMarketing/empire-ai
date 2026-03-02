export function ProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Tell Us Your Vision",
      description: "Share your goals, skills, and resources. Our AI analyzes thousands of data points to find your perfect business match.",
    },
    {
      number: "02", 
      title: "AI Generates Your Blueprint",
      description: "Receive a complete business plan, legal documents, branding, and website design tailored specifically to your vision.",
    },
    {
      number: "03",
      title: "Launch With One Click",
      description: "Deploy your entire business infrastructure instantly. Website, legal entity, marketing channels - all ready to go.",
    },
    {
      number: "04",
      title: "Scale & Optimize",
      description: "Our AI continuously optimizes your operations, marketing, and growth strategies to maximize your success.",
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-red font-medium mb-4 tracking-wide uppercase text-sm">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            From Idea to Empire in 4 Steps
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-cyan/50 to-transparent z-0" />
              )}
              
              <div className="relative z-10">
                <div className="text-6xl font-bold text-cyan/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
