import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StatsCard } from "@/components/dashboard/stats-card"
import { TrendCard } from "@/components/dashboard/trend-card"
import { IdeaCard } from "@/components/dashboard/idea-card"
import { rankIdeasForUser } from "@/lib/matching"
import {
  TrendingUp,
  Lightbulb,
  Bookmark,
  Crown,
} from "lucide-react"
import type { Trend, BusinessIdea, UserProfile } from "@/lib/supabase/types"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Check onboarding status
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profile && !profile.onboarding_completed) {
    redirect("/onboarding")
  }

  // Fetch data in parallel
  const [trendsRes, ideasRes, userProfileRes, savedRes] = await Promise.all([
    supabase
      .from("trends")
      .select("*")
      .order("trend_date", { ascending: false })
      .order("search_volume", { ascending: false, nullsFirst: false })
      .limit(6),
    supabase
      .from("business_ideas")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("user_interactions")
      .select("*")
      .eq("user_id", user.id)
      .eq("interaction_type", "save"),
  ])

  const trends = (trendsRes.data as Trend[]) || []
  const ideas = (ideasRes.data as BusinessIdea[]) || []
  const userProfile = userProfileRes.data as UserProfile | null
  const savedCount = savedRes.data?.length || 0

  // Rank ideas by match score if user has a profile
  const rankedIdeas = userProfile
    ? rankIdeasForUser(userProfile, ideas).slice(0, 5)
    : ideas.slice(0, 5).map((idea) => ({ ...idea, matchScore: undefined }))

  const firstName = profile?.full_name?.split(" ")[0] || "Builder"

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="text-cyan">{firstName}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s trending in the business world today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Trends"
          value={trends.length}
          icon={TrendingUp}
          description="Tracked today"
        />
        <StatsCard
          title="Business Ideas"
          value={ideas.length}
          icon={Lightbulb}
          description="Generated for you"
        />
        <StatsCard
          title="Saved Ideas"
          value={savedCount}
          icon={Bookmark}
          description="In your collection"
        />
        <StatsCard
          title="Your Tier"
          value={profile?.subscription_tier === "free" ? "Free" : profile?.subscription_tier || "Free"}
          icon={Crown}
          description="Current plan"
        />
      </div>

      {/* Hot Trends */}
      {trends.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Hot Trends</h2>
            <a
              href="/dashboard/trends"
              className="text-sm text-cyan hover:underline"
            >
              View all
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trends.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>
        </div>
      )}

      {/* Top Matched Ideas */}
      {rankedIdeas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {userProfile ? "Top Matches For You" : "Latest Business Ideas"}
            </h2>
            <a
              href="/dashboard/ideas"
              className="text-sm text-cyan hover:underline"
            >
              View all
            </a>
          </div>
          <div className="space-y-4">
            {rankedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                matchScore={"matchScore" in idea ? idea.matchScore : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {trends.length === 0 && ideas.length === 0 && (
        <div className="text-center py-16 rounded-lg border border-border bg-card/50">
          <Lightbulb className="w-12 h-12 text-cyan mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Your empire starts here
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We&apos;re scanning the web for trending business opportunities.
            Check back soon for personalized recommendations.
          </p>
        </div>
      )}
    </div>
  )
}
