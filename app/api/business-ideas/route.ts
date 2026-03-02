import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const difficulty = searchParams.get("difficulty")
  const trendId = searchParams.get("trend_id")
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
  const offset = parseInt(searchParams.get("offset") || "0")

  let query = supabase
    .from("business_ideas")
    .select("*, trends(keyword, category)")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (difficulty) {
    query = query.eq("difficulty", difficulty)
  }

  if (trendId) {
    query = query.eq("trend_id", trendId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ideas: data })
}
