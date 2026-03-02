import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { IdeaCard } from "@/components/dashboard/idea-card"
import { rankIdeasForUser } from "@/lib/matching"
import type { BusinessIdea, UserProfile } from "@/lib/supabase/types"

export default async function IdeasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const [ideasRes, userProfileRes] = await Promise.all([
    supabase
      .from("business_ideas")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single(),
  ])

  const ideas = (ideasRes.data as BusinessIdea[]) || []
  const userProfile = userProfileRes.data as UserProfile | null

  const rankedIdeas = userProfile
    ? rankIdeasForUser(userProfile, ideas)
    : ideas.map((idea) => ({ ...idea, matchScore: undefined }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Business Ideas</h1>
        <p className="text-muted-foreground mt-1">
          {userProfile
            ? "Ideas ranked by how well they match your profile."
            : "Browse all generated business ideas."}
        </p>
      </div>

      {rankedIdeas.length > 0 ? (
        <div className="space-y-4">
          {rankedIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              matchScore={"matchScore" in idea ? idea.matchScore : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-lg border border-border bg-card/50">
          <p className="text-muted-foreground">
            No business ideas generated yet. As trends come in, we&apos;ll
            create personalized suggestions for you.
          </p>
        </div>
      )}
    </div>
  )
}
