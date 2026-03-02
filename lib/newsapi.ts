const NEWSAPI_BASE = "https://newsapi.org/v2"

export type NewsArticle = {
  title: string
  description: string | null
  url: string
  source: { id: string | null; name: string }
  publishedAt: string
  content: string | null
}

export async function fetchTopHeadlines(
  category = "business",
  country = "us"
): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) throw new Error("NEWS_API_KEY not configured")

  const url = new URL(`${NEWSAPI_BASE}/top-headlines`)
  url.searchParams.set("category", category)
  url.searchParams.set("country", country)
  url.searchParams.set("pageSize", "20")
  url.searchParams.set("apiKey", apiKey)

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`NewsAPI error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return data.articles ?? []
}

export async function fetchTrendingNews(
  query: string
): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) throw new Error("NEWS_API_KEY not configured")

  const url = new URL(`${NEWSAPI_BASE}/everything`)
  url.searchParams.set("q", query)
  url.searchParams.set("sortBy", "popularity")
  url.searchParams.set("pageSize", "10")
  url.searchParams.set("language", "en")
  url.searchParams.set("apiKey", apiKey)

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`NewsAPI error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return data.articles ?? []
}
