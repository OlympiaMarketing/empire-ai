import { 
  Lightbulb, 
  FileText, 
  Scale, 
  Globe, 
  Rocket, 
  TrendingUp,
  Target,
  Shield
} from "lucide-react"

const features = [
  {
    icon: Lightbulb,
    title: "Business Selection",
    description: "AI analyzes market trends and your skills to recommend the perfect business model for you.",
    color: "text-cyan",
  },
  {
    icon: Target,
    title: "Strategic Planning",
    description: "Generate comprehensive business plans, roadmaps, and milestones automatically.",
    color: "text-cyan",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Create all necessary business documents, contracts, and templates in minutes.",
    color: "text-cyan",
  },
  {
    icon: Scale,
    title: "Legal Setup",
    description: "Handle business registration, compliance, and legal requirements seamlessly.",
    color: "text-red",
  },
  {
    icon: Globe,
    title: "Website Creation",
    description: "Build stunning, conversion-optimized websites with AI-powered design assistance.",
    color: "text-cyan",
  },
  {
    icon: Shield,
    title: "Management Tools",
    description: "Manage operations, finances, and team collaboration from one unified dashboard.",
    color: "text-cyan",
  },
  {
    icon: Rocket,
    title: "Deployment",
    description: "Launch your business with automated deployment, hosting, and infrastructure setup.",
    color: "text-red",
  },
  {
    icon: TrendingUp,
    title: "Marketing & Growth",
    description: "AI-driven marketing strategies, SEO optimization, and customer acquisition tools.",
    color: "text-cyan",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-cyan font-medium mb-4 tracking-wide uppercase text-sm">Complete Platform</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Everything You Need to Build,<br />Launch, and Scale
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI handles every aspect of building your online empire. No technical skills required.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-lg border border-border bg-card/50 hover:bg-card hover:border-cyan/30 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-cyan/10 transition-colors`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
