export type SubscriptionTier = "free" | "starter" | "empire_builder" | "enterprise"
export type SubscriptionStatus = "active" | "inactive" | "past_due" | "canceled"
export type BusinessStage =
  | "planning"
  | "legal"
  | "banking"
  | "website"
  | "operations"
  | "marketing"
  | "funding"
  | "launched"
export type Difficulty = "easy" | "medium" | "hard"
export type TrendSource = "google_trends" | "news_api" | "manual"
export type InteractionType = "view" | "like" | "save" | "dismiss"
export type DocType =
  | "business_plan"
  | "operating_agreement"
  | "articles_of_org"
  | "bylaws"
  | "pitch_deck"
  | "marketing_plan"
  | "financial_projection"

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  stripe_customer_id: string | null
  subscription_tier: SubscriptionTier
  subscription_status: SubscriptionStatus
  stripe_subscription_id: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export type UserProfile = {
  id: string
  user_id: string
  risk_tolerance: "low" | "medium" | "high" | null
  skills: string[]
  interests: string[]
  budget_range: string | null
  time_commitment: string | null
  experience_level: "none" | "beginner" | "intermediate" | "expert" | null
  preferred_industries: string[]
  personality_type: string | null
  goals: string | null
  strengths: string | null
  weaknesses: string | null
  location: string | null
  current_occupation: string | null
  work_style: "solo" | "team" | "either" | null
  income_goal: string | null
  timeline: string | null
  created_at: string
  updated_at: string
}

export type Trend = {
  id: string
  keyword: string
  search_volume: number | null
  category: string | null
  source: TrendSource
  region: string
  trend_date: string
  interest_over_time: Record<string, number> | null
  related_queries: string[] | null
  raw_data: Record<string, unknown> | null
  created_at: string
}

export type BusinessIdea = {
  id: string
  trend_id: string | null
  title: string
  description: string
  target_market: string | null
  revenue_model: string | null
  difficulty: Difficulty | null
  estimated_startup_cost: string | null
  required_skills: string[]
  tags: string[]
  ai_confidence_score: number | null
  view_count: number
  like_count: number
  save_count: number
  created_at: string
}

export type UserBusiness = {
  id: string
  user_id: string
  idea_id: string | null
  business_name: string
  stage: BusinessStage
  business_plan: Record<string, unknown> | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type BusinessDocument = {
  id: string
  business_id: string
  doc_type: DocType
  content: string
  status: "draft" | "final"
  created_at: string
  updated_at: string
}

export type UserInteraction = {
  id: string
  user_id: string
  idea_id: string
  interaction_type: InteractionType
  created_at: string
}
