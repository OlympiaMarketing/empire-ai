import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

type GeneratedIdea = {
  title: string
  description: string
  target_market: string
  revenue_model: string
  difficulty: "easy" | "medium" | "hard"
  estimated_startup_cost: string
  required_skills: string[]
  tags: string[]
  ai_confidence_score: number
}

// Template-based idea generation (swap in AI API call later)
function generateIdeasFromTrend(
  keyword: string,
  category: string | null,
  relatedQueries: string[] | null
): GeneratedIdea[] {
  const ideas: GeneratedIdea[] = []
  const cat = category || "general"

  const templates: Record<string, Array<(kw: string) => GeneratedIdea>> = {
    technology: [
      (kw) => ({
        title: `${kw} SaaS Platform`,
        description: `Build a SaaS tool that leverages the growing interest in ${kw}. Offer a subscription-based platform that solves key pain points for businesses and professionals in this space.`,
        target_market: "Small to medium businesses, tech professionals",
        revenue_model: "Monthly/annual SaaS subscription",
        difficulty: "hard",
        estimated_startup_cost: "$5,000 - $25,000",
        required_skills: ["software development", "product management", "marketing"],
        tags: [cat, "saas", "subscription", kw.toLowerCase()],
        ai_confidence_score: 0.75,
      }),
      (kw) => ({
        title: `${kw} Online Course & Community`,
        description: `Create an educational platform teaching people about ${kw}. Combine video courses, live workshops, and a private community for ongoing learning and networking.`,
        target_market: "Aspiring professionals, career changers, enthusiasts",
        revenue_model: "Course sales + community membership",
        difficulty: "medium",
        estimated_startup_cost: "$1,000 - $5,000",
        required_skills: ["subject expertise", "content creation", "teaching"],
        tags: [cat, "education", "community", kw.toLowerCase()],
        ai_confidence_score: 0.8,
      }),
    ],
    ecommerce: [
      (kw) => ({
        title: `${kw} Curated Subscription Box`,
        description: `Launch a monthly subscription box around the ${kw} trend. Curate products, partner with brands, and build a loyal subscriber base through unique themed boxes.`,
        target_market: "Enthusiasts, gift buyers, trend-conscious consumers",
        revenue_model: "Monthly subscription + one-time purchases",
        difficulty: "medium",
        estimated_startup_cost: "$3,000 - $10,000",
        required_skills: ["product sourcing", "branding", "logistics"],
        tags: [cat, "subscription", "physical products", kw.toLowerCase()],
        ai_confidence_score: 0.7,
      }),
    ],
    content: [
      (kw) => ({
        title: `${kw} Media Brand & Newsletter`,
        description: `Build a media brand around ${kw}. Start with a newsletter and expand to podcasts, YouTube, and social media. Monetize through sponsorships, ads, and premium content.`,
        target_market: "Professionals and enthusiasts interested in the topic",
        revenue_model: "Sponsorships, ads, premium subscriptions",
        difficulty: "easy",
        estimated_startup_cost: "$500 - $2,000",
        required_skills: ["writing", "content creation", "social media"],
        tags: [cat, "media", "newsletter", kw.toLowerCase()],
        ai_confidence_score: 0.85,
      }),
    ],
    services: [
      (kw) => ({
        title: `${kw} Consulting Agency`,
        description: `Start a consulting agency specializing in ${kw}. Help businesses navigate this trending area with expert guidance, strategy development, and implementation support.`,
        target_market: "Businesses looking to leverage this trend",
        revenue_model: "Retainer fees, project-based billing",
        difficulty: "medium",
        estimated_startup_cost: "$1,000 - $5,000",
        required_skills: ["industry expertise", "consulting", "sales"],
        tags: [cat, "consulting", "b2b", kw.toLowerCase()],
        ai_confidence_score: 0.78,
      }),
    ],
  }

  // Get category-specific templates, plus general templates
  const categoryTemplates = templates[cat] || []
  const generalTemplates = [
    (kw: string) => ({
      title: `${kw} Digital Marketplace`,
      description: `Create a niche marketplace connecting buyers and sellers in the ${kw} space. Take a commission on each transaction while building a trusted platform.`,
      target_market: "Buyers and sellers in this niche",
      revenue_model: "Transaction fees, listing fees, premium features",
      difficulty: "hard" as const,
      estimated_startup_cost: "$5,000 - $20,000",
      required_skills: ["platform development", "marketing", "operations"],
      tags: ["marketplace", "platform", kw.toLowerCase()],
      ai_confidence_score: 0.65,
    }),
    (kw: string) => ({
      title: `${kw} Automation Tool`,
      description: `Build a tool that automates common tasks related to ${kw}. Target professionals who want to save time and increase efficiency in this growing area.`,
      target_market: "Professionals and businesses",
      revenue_model: "Freemium SaaS subscription",
      difficulty: "hard" as const,
      estimated_startup_cost: "$3,000 - $15,000",
      required_skills: ["software development", "UX design", "marketing"],
      tags: ["automation", "tool", "saas", kw.toLowerCase()],
      ai_confidence_score: 0.72,
    }),
    (kw: string) => ({
      title: `${kw} Content & Affiliate Site`,
      description: `Build a content website focused on ${kw}. Create reviews, guides, and comparisons. Monetize through affiliate partnerships, display ads, and sponsored content.`,
      target_market: "People searching for information about this topic",
      revenue_model: "Affiliate commissions, display ads, sponsored content",
      difficulty: "easy" as const,
      estimated_startup_cost: "$200 - $1,000",
      required_skills: ["SEO", "content writing", "basic web development"],
      tags: ["content", "affiliate", "seo", kw.toLowerCase()],
      ai_confidence_score: 0.82,
    }),
  ]

  for (const template of [...categoryTemplates, ...generalTemplates]) {
    ideas.push(template(keyword))
  }

  return ideas
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { trend_id } = body

  if (!trend_id) {
    return NextResponse.json(
      { error: "trend_id is required" },
      { status: 400 }
    )
  }

  // Fetch the trend
  const { data: trend, error: trendError } = await supabase
    .from("trends")
    .select("*")
    .eq("id", trend_id)
    .single()

  if (trendError || !trend) {
    return NextResponse.json({ error: "Trend not found" }, { status: 404 })
  }

  // Generate ideas
  const ideas = generateIdeasFromTrend(
    trend.keyword,
    trend.category,
    trend.related_queries
  )

  // Insert into database
  const ideasToInsert = ideas.map((idea) => ({
    ...idea,
    trend_id,
  }))

  const { data: insertedIdeas, error: insertError } = await getSupabaseAdmin()
    .from("business_ideas")
    .insert(ideasToInsert)
    .select()

  if (insertError) {
    console.error("Failed to insert ideas:", insertError)
    return NextResponse.json(
      { error: "Failed to generate ideas" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    ideas: insertedIdeas,
    count: insertedIdeas?.length ?? 0,
  })
}
