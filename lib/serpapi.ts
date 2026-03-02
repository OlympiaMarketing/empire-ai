const SERPAPI_BASE = "https://serpapi.com/search.json"

export type SerpApiTrend = {
  query: string
  traffic: number | string
  related_queries?: Array<{ query: string }>
  articles?: Array<{
    title: string
    link: string
    source: string
    snippet?: string
  }>
}

export async function fetchTrendingSearches(
  region = "US"
): Promise<SerpApiTrend[]> {
  const apiKey = process.env.SERPAPI_API_KEY
  if (!apiKey) throw new Error("SERPAPI_API_KEY not configured")

  const url = new URL(SERPAPI_BASE)
  url.searchParams.set("engine", "google_trends_trending_now")
  url.searchParams.set("frequency", "daily")
  url.searchParams.set("geo", region)
  url.searchParams.set("api_key", apiKey)

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`SerpAPI error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return (
    data.daily_searches?.flatMap(
      (day: { searches: SerpApiTrend[] }) => day.searches
    ) ?? []
  )
}

export async function fetchTrendInterest(keyword: string, region = "US") {
  const apiKey = process.env.SERPAPI_API_KEY
  if (!apiKey) throw new Error("SERPAPI_API_KEY not configured")

  const url = new URL(SERPAPI_BASE)
  url.searchParams.set("engine", "google_trends")
  url.searchParams.set("q", keyword)
  url.searchParams.set("geo", region)
  url.searchParams.set("api_key", apiKey)

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`SerpAPI interest error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
