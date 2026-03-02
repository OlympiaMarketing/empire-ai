import type { UserProfile, BusinessIdea } from "@/lib/supabase/types"

export function scoreIdeaForUser(
  profile: UserProfile,
  idea: BusinessIdea
): number {
  let score = 50 // Base score
  let factors = 0

  // Skills match (0-25 points)
  if (profile.skills.length > 0 && idea.required_skills.length > 0) {
    const profileSkillsLower = profile.skills.map((s) => s.toLowerCase())
    const matchingSkills = idea.required_skills.filter((skill) =>
      profileSkillsLower.some(
        (ps) => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps)
      )
    )
    const skillScore = (matchingSkills.length / idea.required_skills.length) * 25
    score += skillScore
    factors++
  }

  // Budget match (0-20 points)
  if (profile.budget_range && idea.estimated_startup_cost) {
    const budgetMap: Record<string, number> = {
      "$0 - $500 (bootstrapping)": 250,
      "$500 - $2,000": 1250,
      "$2,000 - $10,000": 6000,
      "$10,000+ (well-funded)": 15000,
    }
    const costMap: Record<string, number> = {
      "$200 - $1,000": 600,
      "$500 - $2,000": 1250,
      "$1,000 - $5,000": 3000,
      "$3,000 - $10,000": 6500,
      "$3,000 - $15,000": 9000,
      "$5,000 - $20,000": 12500,
      "$5,000 - $25,000": 15000,
    }

    const userBudget = budgetMap[profile.budget_range] ?? 5000
    const ideaCost = costMap[idea.estimated_startup_cost] ?? 5000

    if (userBudget >= ideaCost) {
      score += 20
    } else if (userBudget >= ideaCost * 0.5) {
      score += 10
    }
    factors++
  }

  // Risk/difficulty match (0-15 points)
  if (profile.risk_tolerance && idea.difficulty) {
    const riskDiffMap: Record<string, string[]> = {
      low: ["easy"],
      medium: ["easy", "medium"],
      high: ["easy", "medium", "hard"],
    }
    if (riskDiffMap[profile.risk_tolerance]?.includes(idea.difficulty)) {
      score += 15
    } else {
      score -= 5
    }
    factors++
  }

  // Industry/interest match (0-20 points)
  if (profile.preferred_industries.length > 0 && idea.tags.length > 0) {
    const industriesLower = profile.preferred_industries.map((i) =>
      i.toLowerCase()
    )
    const tagsLower = idea.tags.map((t) => t.toLowerCase())
    const hasMatch = tagsLower.some(
      (tag) =>
        industriesLower.some((ind) => ind.includes(tag) || tag.includes(ind))
    )
    if (hasMatch) {
      score += 20
    }
    factors++
  }

  // Interest overlap with tags (0-10 points)
  if (profile.interests.length > 0 && idea.tags.length > 0) {
    const interestsLower = profile.interests.map((i) => i.toLowerCase())
    const tagsLower = idea.tags.map((t) => t.toLowerCase())
    const hasMatch = tagsLower.some(
      (tag) =>
        interestsLower.some((int) => int.includes(tag) || tag.includes(int))
    )
    if (hasMatch) {
      score += 10
    }
    factors++
  }

  // AI confidence boost (0-10 points)
  if (idea.ai_confidence_score) {
    score += idea.ai_confidence_score * 10
  }

  // Normalize to 0-100
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function rankIdeasForUser(
  profile: UserProfile,
  ideas: BusinessIdea[]
): Array<BusinessIdea & { matchScore: number }> {
  return ideas
    .map((idea) => ({
      ...idea,
      matchScore: scoreIdeaForUser(profile, idea),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
}
