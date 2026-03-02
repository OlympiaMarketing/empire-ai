import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { fetchTrendingSearches } from "@/lib/serpapi"
import { fetchTopHeadlines } from "@/lib/newsapi"
import { processTrends } from "@/lib/trends/processor"

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this as Bearer token)
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET?.trim()
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch from both sources in parallel
    const [serpTrends, newsArticles] = await Promise.allSettled([
      fetchTrendingSearches("US"),
      fetchTopHeadlines("business", "us"),
    ])

    const serpData =
      serpTrends.status === "fulfilled" ? serpTrends.value : []
    const newsData =
      newsArticles.status === "fulfilled" ? newsArticles.value : []

    if (serpData.length === 0 && newsData.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No trends fetched from any source",
        errors: {
          serp: serpTrends.status === "rejected" ? serpTrends.reason?.message : null,
          news: newsArticles.status === "rejected" ? newsArticles.reason?.message : null,
        },
      }, { status: 502 })
    }

    // Process and normalize
    const processedTrends = processTrends(serpData, newsData, "US")

    if (processedTrends.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No new trends to insert",
        trendsProcessed: 0,
      })
    }

    // Upsert into Supabase (de-duplicate by keyword + date)
    const { error } = await getSupabaseAdmin().from("trends").upsert(
      processedTrends,
      {
        onConflict: "keyword,trend_date",
        ignoreDuplicates: true,
      }
    )

    if (error) {
      console.error("Supabase upsert error:", error)
      throw error
    }

    return NextResponse.json({
      success: true,
      trendsProcessed: processedTrends.length,
      sources: {
        googleTrends: serpData.length,
        newsApi: newsData.length,
      },
    })
  } catch (err) {
    console.error("Cron scan-trends error:", err)
    return NextResponse.json(
      { error: "Scan failed", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
