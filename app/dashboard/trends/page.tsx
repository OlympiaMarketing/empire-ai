import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TrendCard } from "@/components/dashboard/trend-card"
import type { Trend } from "@/lib/supabase/types"

export default async function TrendsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data } = await supabase
    .from("trends")
    .select("*")
    .order("trend_date", { ascending: false })
    .order("search_volume", { ascending: false, nullsFirst: false })
    .limit(50)

  const trends = (data as Trend[]) || []

  // Group by category
  const categories = Array.from(
    new Set(trends.map((t) => t.category).filter(Boolean))
  ) as string[]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Trending Now</h1>
        <p className="text-muted-foreground mt-1">
          Real-time trends from Google and top news sources, updated every 6
          hours.
        </p>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1 rounded-full bg-secondary text-sm text-muted-foreground capitalize"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {trends.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.map((trend) => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-lg border border-border bg-card/50">
          <p className="text-muted-foreground">
            No trends yet. The scanner runs every 6 hours — check back soon.
          </p>
        </div>
      )}
    </div>
  )
}
