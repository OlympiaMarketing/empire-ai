"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { QuizStep, type QuizStepData } from "@/components/onboarding/quiz-step"
import { Loader2 } from "lucide-react"

const QUIZ_STEPS: QuizStepData[] = [
  {
    title: "About You",
    subtitle: "Let's get to know you a little better.",
    questions: [
      {
        id: "location",
        label: "Where are you based?",
        type: "text",
        placeholder: "City, State/Country",
      },
      {
        id: "current_occupation",
        label: "What's your current occupation?",
        type: "text",
        placeholder: "e.g., Software Engineer, Teacher, Student...",
      },
    ],
  },
  {
    title: "Experience Level",
    subtitle: "Help us understand your background.",
    questions: [
      {
        id: "experience_level",
        label: "How much business experience do you have?",
        type: "select",
        options: [
          "None — this is my first venture",
          "Beginner — I've tried a side project or two",
          "Intermediate — I've run a small business",
          "Expert — I've built and scaled businesses",
        ],
      },
      {
        id: "skills",
        label: "What skills do you bring to the table? (select all that apply)",
        type: "multi-select",
        options: [
          "Software Development",
          "Design & Creative",
          "Marketing & Sales",
          "Finance & Accounting",
          "Writing & Content",
          "Project Management",
          "Data Analysis",
          "Customer Service",
          "Operations & Logistics",
          "Legal & Compliance",
          "Teaching & Coaching",
          "Video Production",
        ],
      },
    ],
  },
  {
    title: "Your Personality",
    subtitle: "Understanding how you work helps us find the right fit.",
    questions: [
      {
        id: "risk_tolerance",
        label: "How would you describe your risk tolerance?",
        type: "select",
        options: [
          "Low — I prefer stable, proven models",
          "Medium — I'm open to calculated risks",
          "High — I thrive on bold, innovative moves",
        ],
      },
      {
        id: "work_style",
        label: "How do you prefer to work?",
        type: "select",
        options: [
          "Solo — I like full control and independence",
          "Team — I collaborate best with others",
          "Either — I'm flexible and adaptable",
        ],
      },
      {
        id: "personality_type",
        label: "Which best describes your personality?",
        type: "select",
        options: [
          "Visionary — I love big ideas and strategy",
          "Builder — I enjoy creating and making things",
          "Optimizer — I improve systems and processes",
          "Connector — I bring people and ideas together",
        ],
      },
    ],
  },
  {
    title: "Your Goals",
    subtitle: "What does success look like for you?",
    questions: [
      {
        id: "income_goal",
        label: "What's your monthly income goal from this business?",
        type: "select",
        options: [
          "$1,000 - $3,000 (side income)",
          "$3,000 - $7,000 (replace my salary)",
          "$7,000 - $15,000 (comfortable living)",
          "$15,000+ (build serious wealth)",
        ],
      },
      {
        id: "timeline",
        label: "When do you want to see results?",
        type: "select",
        options: [
          "1-3 months — I want fast results",
          "3-6 months — I can be patient",
          "6-12 months — I'm in it for the long game",
          "1+ years — Building something big takes time",
        ],
      },
      {
        id: "goals",
        label: "What's your #1 goal? (in your own words)",
        type: "textarea",
        placeholder: "e.g., Quit my 9-5, build passive income, create something I'm proud of...",
      },
    ],
  },
  {
    title: "Your Resources",
    subtitle: "Let's understand what you're working with.",
    questions: [
      {
        id: "budget_range",
        label: "How much can you invest to get started?",
        type: "select",
        options: [
          "$0 - $500 (bootstrapping)",
          "$500 - $2,000",
          "$2,000 - $10,000",
          "$10,000+ (well-funded)",
        ],
      },
      {
        id: "time_commitment",
        label: "How much time can you dedicate per week?",
        type: "select",
        options: [
          "5-10 hours (side hustle pace)",
          "10-20 hours (serious commitment)",
          "20-40 hours (part-time focus)",
          "40+ hours (full-time dedication)",
        ],
      },
    ],
  },
  {
    title: "Your Interests",
    subtitle: "What industries and topics excite you?",
    questions: [
      {
        id: "preferred_industries",
        label: "Which industries interest you? (select all that apply)",
        type: "multi-select",
        options: [
          "Technology & SaaS",
          "E-commerce & Retail",
          "Health & Wellness",
          "Finance & Investing",
          "Education & Coaching",
          "Content & Media",
          "Food & Beverage",
          "Real Estate",
          "Travel & Hospitality",
          "Fashion & Beauty",
          "Gaming & Entertainment",
          "Sustainability & Green",
          "B2B Services",
          "Arts & Creative",
        ],
      },
      {
        id: "interests",
        label: "Any specific topics you're passionate about?",
        type: "multi-select",
        options: [
          "Artificial Intelligence",
          "Social Media",
          "Personal Finance",
          "Fitness & Sports",
          "Cooking & Food",
          "Productivity Tools",
          "Mental Health",
          "Parenting & Family",
          "Home Improvement",
          "Pets & Animals",
          "Outdoor & Adventure",
          "Music & Audio",
        ],
      },
    ],
  },
  {
    title: "Strengths & Challenges",
    subtitle: "This helps us recommend the right support for you.",
    questions: [
      {
        id: "strengths",
        label: "What are you great at?",
        type: "textarea",
        placeholder: "e.g., I'm great at talking to people, I learn fast, I'm super organized...",
      },
      {
        id: "weaknesses",
        label: "Where do you need the most help?",
        type: "textarea",
        placeholder: "e.g., I struggle with technical stuff, I'm not great at marketing, I need help staying focused...",
      },
    ],
  },
]

function mapExperience(
  value: string
): "none" | "beginner" | "intermediate" | "expert" {
  if (value.startsWith("None")) return "none"
  if (value.startsWith("Beginner")) return "beginner"
  if (value.startsWith("Intermediate")) return "intermediate"
  return "expert"
}

function mapRisk(value: string): "low" | "medium" | "high" {
  if (value.startsWith("Low")) return "low"
  if (value.startsWith("Medium")) return "medium"
  return "high"
}

function mapWorkStyle(value: string): "solo" | "team" | "either" {
  if (value.startsWith("Solo")) return "solo"
  if (value.startsWith("Team")) return "team"
  return "either"
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [values, setValues] = useState<Record<string, string | string[]>>({})
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  function handleChange(questionId: string, value: string | string[]) {
    setValues((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleNext() {
    if (currentStep < QUIZ_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  async function handleSubmit() {
    setSubmitting(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Save user profile data
      const profileData = {
        user_id: user.id,
        location: (values.location as string) || null,
        current_occupation: (values.current_occupation as string) || null,
        experience_level: values.experience_level
          ? mapExperience(values.experience_level as string)
          : null,
        skills: (values.skills as string[]) || [],
        risk_tolerance: values.risk_tolerance
          ? mapRisk(values.risk_tolerance as string)
          : null,
        work_style: values.work_style
          ? mapWorkStyle(values.work_style as string)
          : null,
        personality_type: (values.personality_type as string) || null,
        income_goal: (values.income_goal as string) || null,
        timeline: (values.timeline as string) || null,
        goals: (values.goals as string) || null,
        budget_range: (values.budget_range as string) || null,
        time_commitment: (values.time_commitment as string) || null,
        preferred_industries: (values.preferred_industries as string[]) || [],
        interests: (values.interests as string[]) || [],
        strengths: (values.strengths as string) || null,
        weaknesses: (values.weaknesses as string) || null,
      }

      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert(profileData, { onConflict: "user_id" })

      if (profileError) {
        console.error("Failed to save profile:", profileError)
      }

      // Mark onboarding as completed
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", user.id)

      if (updateError) {
        console.error("Failed to update onboarding status:", updateError)
      }

      router.push("/dashboard")
    } catch (err) {
      console.error("Onboarding error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-cyan mx-auto" />
          <h2 className="text-xl font-semibold">
            Analyzing your profile...
          </h2>
          <p className="text-muted-foreground">
            We&apos;re matching you with the best business opportunities
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 justify-center mb-12"
        >
          <div className="w-8 h-8 rounded bg-cyan flex items-center justify-center">
            <span className="font-bold text-background text-sm">E</span>
          </div>
          <span className="font-bold text-xl">Empire.AI</span>
        </Link>

        <div className="rounded-xl border border-border bg-card p-8">
          <QuizStep
            step={QUIZ_STEPS[currentStep]}
            currentStep={currentStep}
            totalSteps={QUIZ_STEPS.length}
            values={values}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
      </div>
    </div>
  )
}
