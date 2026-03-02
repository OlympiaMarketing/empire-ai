import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { IdeaCard } from "@/components/dashboard/idea-card"
import type { BusinessIdea } from "@/lib/supabase/types"
import { Bookmark } from "lucide-react"

export default async function SavedPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Get saved idea IDs
  const { data: interactions } = await supabase
    .from("user_interactions")
    .select("idea_id")
    .eq("user_id", user.id)
    .eq("interaction_type", "save")

  const savedIdeaIds = interactions?.map((i) => i.idea_id) || []

  let ideas: BusinessIdea[] = []
  if (savedIdeaIds.length > 0) {
    const { data } = await supabase
      .from("business_ideas")
      .select("*")
      .in("id", savedIdeaIds)
      .order("created_at", { ascending: false })
    ideas = (data as BusinessIdea[]) || []
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Saved Ideas</h1>
        <p className="text-muted-foreground mt-1">
          Ideas you&apos;ve bookmarked for later.
        </p>
      </div>

      {ideas.length > 0 ? (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} isSaved />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-lg border border-border bg-card/50">
          <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No saved ideas yet</h2>
          <p className="text-muted-foreground">
            Browse business ideas and save the ones that interest you.
          </p>
        </div>
      )}
    </div>
  )
}
