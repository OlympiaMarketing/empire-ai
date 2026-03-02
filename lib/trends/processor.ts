import type { SerpApiTrend } from "@/lib/serpapi"
import type { NewsArticle } from "@/lib/newsapi"

type ProcessedTrend = {
  keyword: string
  search_volume: number | null
  category: string | null
  source: "google_trends" | "news_api"
  region: string
  trend_date: string
  interest_over_time: Record<string, number> | null
  related_queries: string[] | null
  raw_data: Record<string, unknown> | null
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  technology: [
    "ai", "tech", "software", "app", "crypto", "blockchain", "saas",
    "cloud", "data", "cyber", "robot", "automat", "digital", "code",
    "programming", "developer", "startup",
  ],
  finance: [
    "stock", "invest", "bank", "financ", "money", "trading", "crypto",
    "bitcoin", "etherium", "fund", "loan", "credit", "wealth", "profit",
  ],
  health: [
    "health", "fitness", "medical", "wellness", "mental", "diet",
    "nutrition", "pharma", "biotech", "workout", "yoga", "therap",
  ],
  ecommerce: [
    "ecommerce", "shop", "retail", "product", "sell", "amazon",
    "dropship", "store", "brand", "merch", "subscription box",
  ],
  education: [
    "learn", "course", "educat", "teach", "tutor", "skill", "certif",
    "training", "online class", "mentor",
  ],
  content: [
    "content", "creator", "youtube", "podcast", "blog", "newsletter",
    "media", "influenc", "social", "tiktok", "instagram",
  ],
  services: [
    "consult", "freelanc", "agency", "service", "coaching", "design",
    "market", "seo", "adviso",
  ],
}

function classifyCategory(keyword: string): string | null {
  const lower = keyword.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category
    }
  }
  return null
}

function parseTraffic(traffic: number | string): number | null {
  if (typeof traffic === "number") return traffic
  if (typeof traffic === "string") {
    const cleaned = traffic.replace(/[^0-9]/g, "")
    return cleaned ? parseInt(cleaned, 10) : null
  }
  return null
}

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "both",
  "each", "few", "more", "most", "other", "some", "such", "no", "nor",
  "not", "only", "own", "same", "so", "than", "too", "very", "just",
  "because", "but", "and", "or", "if", "while", "about", "up", "its",
  "it", "he", "she", "they", "them", "his", "her", "this", "that",
  "these", "those", "what", "which", "who", "whom", "new", "says",
  "said", "also", "get", "gets", "got", "make", "makes", "made",
])

function extractKeywordsFromHeadline(title: string): string[] {
  const words = title
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()))

  if (words.length <= 4) return [words.join(" ")]

  // Extract meaningful 2-3 word phrases
  const phrases: string[] = []
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i + 1]}`)
    if (i < words.length - 2) {
      phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`)
    }
  }

  return phrases.slice(0, 3)
}

export function processSerpApiTrends(
  trends: SerpApiTrend[],
  region = "US"
): ProcessedTrend[] {
  const today = new Date().toISOString().split("T")[0]

  return trends.map((trend) => ({
    keyword: trend.query,
    search_volume: parseTraffic(trend.traffic),
    category: classifyCategory(trend.query),
    source: "google_trends" as const,
    region,
    trend_date: today,
    interest_over_time: null,
    related_queries:
      trend.related_queries?.map((rq) => rq.query).slice(0, 10) ?? null,
    raw_data: trend as unknown as Record<string, unknown>,
  }))
}

export function processNewsArticles(
  articles: NewsArticle[],
  region = "US"
): ProcessedTrend[] {
  const today = new Date().toISOString().split("T")[0]
  const keywordMap = new Map<string, ProcessedTrend>()

  for (const article of articles) {
    if (!article.title) continue

    const keywords = extractKeywordsFromHeadline(article.title)
    for (const keyword of keywords) {
      if (keyword.length < 4) continue

      const normalized = keyword.toLowerCase().trim()
      if (!keywordMap.has(normalized)) {
        keywordMap.set(normalized, {
          keyword: keyword.trim(),
          search_volume: null,
          category: classifyCategory(keyword),
          source: "news_api",
          region,
          trend_date: today,
          interest_over_time: null,
          related_queries: null,
          raw_data: {
            source_article: article.title,
            source_name: article.source.name,
            url: article.url,
          },
        })
      }
    }
  }

  return Array.from(keywordMap.values())
}

export function processTrends(
  serpTrends: SerpApiTrend[],
  newsArticles: NewsArticle[],
  region = "US"
): ProcessedTrend[] {
  const fromSerp = processSerpApiTrends(serpTrends, region)
  const fromNews = processNewsArticles(newsArticles, region)

  // Deduplicate: prefer SerpAPI data (has volume) over news-derived keywords
  const seen = new Set<string>()
  const results: ProcessedTrend[] = []

  for (const trend of fromSerp) {
    const key = trend.keyword.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      results.push(trend)
    }
  }

  for (const trend of fromNews) {
    const key = trend.keyword.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      results.push(trend)
    }
  }

  return results
}
